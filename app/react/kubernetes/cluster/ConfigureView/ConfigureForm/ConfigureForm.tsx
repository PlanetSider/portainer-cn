import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useTransitionHook } from '@uirouter/react';

import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { IngressClassDatatable } from '@/react/kubernetes/cluster/ingressClass/IngressClassDatatable';
import {
  Environment,
  EnvironmentId,
} from '@/react/portainer/environments/types';
import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { SwitchField } from '@@/form-components/SwitchField';
import { FormActions } from '@@/form-components/FormActions';
import { confirmGenericDiscard } from '@@/modals/confirm';
import { InsightsBox } from '@@/InsightsBox';

import { useIngressControllerClassMapQuery } from '../../ingressClass/useIngressControllerClassMap';
import { IngressControllerClassMap } from '../../ingressClass/types';
import { useIsRBACEnabled } from '../../useIsRBACEnabled';
import { getIngressClassesFormValues } from '../../ingressClass/IngressClassDatatable/utils';

import { useStorageClassesFormValues } from './useStorageClasses';
import { ConfigureFormValues, StorageClassFormValues } from './types';
import { configureValidationSchema } from './validation';
import { RBACAlert } from './RBACAlert';
import { EnableMetricsInput } from './EnableMetricsInput';
import { StorageClassDatatable } from './StorageClassDatatable';
import { useConfigureClusterMutation } from './useConfigureClusterMutation';
import { handleSubmitConfigureCluster } from './handleSubmitConfigureCluster';

export function ConfigureForm() {
  const configureClusterMutation = useConfigureClusterMutation();
  // get the initial values
  const { data: environment } = useCurrentEnvironment();
  const { data: storageClassFormValues } =
    useStorageClassesFormValues(environment);
  const { data: ingressClasses, ...ingressClassesQuery } =
    useIngressControllerClassMapQuery({
      environmentId: environment?.Id,
    });
  const initialValues = useInitialValues(
    environment,
    storageClassFormValues,
    ingressClasses
  );

  if (!initialValues || !environment) {
    return null;
  }

  return (
    <Formik<ConfigureFormValues>
      initialValues={initialValues}
      onSubmit={(
        values: ConfigureFormValues,
        formikHelpers: FormikHelpers<ConfigureFormValues>
      ) => {
        handleSubmitConfigureCluster(
          values,
          initialValues,
          configureClusterMutation,
          formikHelpers,
          environment
        );
      }}
      validationSchema={configureValidationSchema}
      validateOnMount
      enableReinitialize // enableReinitialize is needed to update the form values when the ingress classes data is fetched
    >
      {(formikProps) => (
        <InnerForm
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formikProps}
          isIngressClassesLoading={ingressClassesQuery.isLoading}
          environmentId={environment.Id}
        />
      )}
    </Formik>
  );
}

function InnerForm({
  initialValues,
  setFieldValue,
  isValid,
  isSubmitting,
  values,
  errors,
  isIngressClassesLoading,
  environmentId,
}: FormikProps<ConfigureFormValues> & {
  isIngressClassesLoading: boolean;
  environmentId: EnvironmentId;
}) {
  const { data: isRBACEnabled, ...isRBACEnabledQuery } =
    useIsRBACEnabled(environmentId);

  const onChangeControllers = useCallback(
    (controllerClassMap: IngressControllerClassMap[]) =>
      setFieldValue('ingressClasses', controllerClassMap),
    [setFieldValue]
  );

  // when navigating away from the page with unsaved changes, show a portainer prompt to confirm
  useTransitionHook('onBefore', {}, async () => {
    if (!isFormChanged(values, initialValues)) {
      return true;
    }
    const confirmed = await confirmGenericDiscard();
    return confirmed;
  });

  // when reloading or exiting the page with unsaved changes, show a browser prompt to confirm
  useEffect(() => {
    // the handler for showing the prompt
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
    function handler(event: BeforeUnloadEvent) {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    }

    // if the form is changed, then set the onbeforeunload
    if (isFormChanged(values, initialValues)) {
      window.addEventListener('beforeunload', handler);
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }
    return () => {};
  }, [values, initialValues]);

  return (
    <Form className="form-horizontal">
      <div className="flex flex-col">
        <FormSection title="网络 - Services">
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                启用负载均衡功能后，用户可以通过云服务提供商分配的外部 IP
                地址来公开其部署的应用。
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="orange" inline={false}>
                如果你想使用此功能，请确认云服务提供商允许创建负载均衡器。
                这可能会产生额外费用。
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="useLoadBalancer"
                data-cy="kubeSetup-loadBalancerToggle"
                label="允许用户使用外部负载均衡器"
                labelClass="col-sm-5 col-lg-4"
                checked={values.useLoadBalancer}
                onChange={(checked) =>
                  setFieldValue('useLoadBalancer', checked)
                }
              />
            </div>
          </div>
        </FormSection>
        <FormSection title="网络 - Ingresses">
          <IngressClassDatatable
            onChange={onChangeControllers}
            description="启用集群中的 ingress controller 后，它们将出现在 Portainer 界面中，供用户通过 HTTP/HTTPS 发布应用。控制器必须具备 class 名称，才会显示在这里。"
            values={values.ingressClasses}
            initialValues={initialValues.ingressClasses}
            isLoading={isIngressClassesLoading}
            view="cluster"
            noIngressControllerLabel="未找到受支持的 ingress controller。"
          />
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="allowNoneIngressClass"
                data-cy="kubeSetup-allowNoneIngressClass"
                label='允许将 ingress class 设置为 "none"'
                tooltip='启用后，用户在配置 ingress 时可以选择 "none" 作为 ingress class。'
                labelClass="col-sm-5 col-lg-4"
                checked={values.allowNoneIngressClass}
                onChange={(checked) => {
                  setFieldValue('allowNoneIngressClass', checked);
                  // add or remove the none ingress class from the ingress classes list
                  if (checked) {
                    setFieldValue(
                      'ingressClasses',
                      getIngressClassesFormValues(
                        checked,
                        initialValues.ingressClasses
                      )
                    );
                  }
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="ingressAvailabilityPerNamespace"
                data-cy="kubeSetup-ingressAvailabilityPerNamespace"
                label="按命名空间配置 ingress controller 可用性"
                tooltip="允许管理员为每个命名空间配置可供用户在为应用设置 ingress 时选择的 ingress controller。"
                labelClass="col-sm-5 col-lg-4"
                checked={values.ingressAvailabilityPerNamespace}
                onChange={(checked) =>
                  setFieldValue('ingressAvailabilityPerNamespace', checked)
                }
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="restrictStandardUserIngressW"
                data-cy="kubeSetup-restrictStandardUserIngressWToggle"
                label="仅允许管理员部署 ingress"
                featureId={FeatureId.K8S_ADM_ONLY_USR_INGRESS_DEPLY}
                tooltip="启用后仅允许管理员部署 ingress，标准用户将无法执行该操作。"
                labelClass="col-sm-5 col-lg-4"
                checked={values.restrictStandardUserIngressW}
                onChange={(checked) =>
                  setFieldValue('restrictStandardUserIngressW', checked)
                }
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                你可以在创建/编辑 ingress 时设置默认值（主机名和注解）。
                之后用户可在创建/编辑应用时通过主机名下拉框选择这些默认值。
              </TextTip>
            </div>
          </div>
        </FormSection>
        <FormSection title="变更窗口设置">
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="changeWindow.Enabled"
                data-cy="kubeSetup-changeWindowEnabledToggle"
                label="启用变更窗口"
                tooltip="在定义的变更窗口之外，GitOps 不会更新堆栈或应用。"
                labelClass="col-sm-5 col-lg-4"
                checked={false}
                featureId={FeatureId.HIDE_AUTO_UPDATE_WINDOW}
                onChange={() => {}}
              />
            </div>
          </div>
        </FormSection>
        <FormSection title="Security">
          <div className="form-group">
            <div className="col-sm-12">
              {!isRBACEnabled && isRBACEnabledQuery.isSuccess && <RBACAlert />}
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                <p>
                  By default, all the users have access to the default
                  namespace. Enable this option to set accesses on the default
                  namespace.
                </p>
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="restrictDefaultNamespace"
                data-cy="kubeSetup-restrictDefaultNsToggle"
                label="Restrict access to the default namespace"
                labelClass="col-sm-5 col-lg-4"
                checked={values.restrictDefaultNamespace}
                onChange={(checked) =>
                  setFieldValue('restrictDefaultNamespace', checked)
                }
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="restrictSecrets"
                data-cy="kubeSetup-restrictSecretsToggle"
                label="Restrict secret contents access for non-admins (UI only)"
                tooltip="This hides the ability to view or edit in the UI the contents of secrets that a non-admin user did not create themselves but does not prevent it via the command line."
                labelClass="col-sm-5 col-lg-4"
                checked={false}
                featureId={FeatureId.K8S_ADM_ONLY_SECRETS}
                onChange={() => {}}
              />
            </div>
          </div>
        </FormSection>
        <FormSection title="Resources and Metrics">
          <InsightsBox
            insightCloseId="resourceOverCommit"
            className="mb-4"
            header="Allow resource over-commit - UI-only change in 2.20"
            content="Resource over-commit has always been ENABLED in Portainer CE. However, the toggle was incorrectly shown as OFF. This has now been corrected but please note that no functionality has been removed."
          />
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue" inline={false}>
                <p>
                  By DISABLING resource over-commit (highly recommended), you
                  can ONLY assign namespaces CPU and memory resources that are
                  less (in aggregate) than the cluster total minus any system
                  resource reservation.
                </p>
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="orange" inline={false}>
                <p>
                  By ENABLING resource over-commit, you can assign namespaces
                  more resources than are physically available in the cluster.
                  This may lead to unexpected deployment failures if there are
                  insufficient resources to service demand.
                </p>
              </TextTip>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                label="Allow resource over-commit"
                labelClass="col-sm-5 col-lg-4"
                name="resourceOverCommitPercentage"
                checked
                featureId={FeatureId.K8S_SETUP_DEFAULT}
                onChange={(checked: boolean) => {
                  setFieldValue('enableResourceOverCommit', checked);
                  // set 20% as the default resourceOverCommitPercentage value
                  if (!checked) {
                    setFieldValue('resourceOverCommitPercentage', 20);
                  }
                }}
                data-cy="kubeSetup-resourceOverCommitToggle"
              />
            </div>
          </div>
          <EnableMetricsInput
            environmentId={environmentId}
            error={errors.useServerMetrics}
            value={values.useServerMetrics}
          />
        </FormSection>
        <FormSection title="Available storage options">
          {initialValues.storageClasses.length === 0 && (
            <div className="form-group">
              <div className="col-sm-12">
                <TextTip color="orange" inline={false}>
                  Unable to detect any storage class available to persist data.
                  Users won&apos;t be able to persist application data inside
                  this cluster.
                </TextTip>
              </div>
            </div>
          )}
          {initialValues.storageClasses.length > 0 && (
            <>
              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue" inline={false}>
                    <p>
                      Select which storage options will be available for use
                      when deploying applications. Have a look at your storage
                      driver documentation to figure out which access policy to
                      configure and if the volume expansion capability is
                      supported.
                    </p>
                    <p>
                      You can find more information about access modes{' '}
                      <a
                        href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes"
                        target="_blank"
                        rel="noreferrer"
                      >
                        in the official Kubernetes documentation
                      </a>
                      .
                    </p>
                  </TextTip>
                </div>
              </div>
              <StorageClassDatatable
                storageClassValues={values.storageClasses}
              />
            </>
          )}
        </FormSection>
        <FormActions
          submitLabel="Save configuration"
          loadingText="Saving configuration"
          isLoading={isSubmitting}
          isValid={
            isValid &&
            !isIngressClassesLoading &&
            isFormChanged(values, initialValues)
          }
          data-cy="kubeSetup-saveConfigurationButton"
        />
      </div>
    </Form>
  );
}

function useInitialValues(
  environment?: Environment | null,
  storageClassFormValues?: StorageClassFormValues[],
  ingressClasses?: IngressControllerClassMap[]
): ConfigureFormValues | undefined {
  return useMemo(() => {
    if (!environment) {
      return undefined;
    }
    const allowNoneIngressClass =
      !!environment.Kubernetes.Configuration.AllowNoneIngressClass;

    return {
      storageClasses: storageClassFormValues || [],
      useLoadBalancer: !!environment.Kubernetes.Configuration.UseLoadBalancer,
      useServerMetrics: !!environment.Kubernetes.Configuration.UseServerMetrics,
      enableResourceOverCommit:
        !!environment.Kubernetes.Configuration.EnableResourceOverCommit,
      resourceOverCommitPercentage:
        environment.Kubernetes.Configuration.ResourceOverCommitPercentage || 20,
      restrictDefaultNamespace:
        !!environment.Kubernetes.Configuration.RestrictDefaultNamespace,
      restrictStandardUserIngressW:
        !!environment.Kubernetes.Configuration.RestrictStandardUserIngressW,
      ingressAvailabilityPerNamespace:
        !!environment.Kubernetes.Configuration.IngressAvailabilityPerNamespace,
      allowNoneIngressClass,
      ingressClasses:
        getIngressClassesFormValues(allowNoneIngressClass, ingressClasses) ||
        [],
    };
  }, [environment, ingressClasses, storageClassFormValues]);
}

function isFormChanged(
  values: ConfigureFormValues,
  initialValues: ConfigureFormValues
) {
  // check if the form values are different from the initial values
  return !_.isEqual(values, initialValues);
}
