import { Field, Form, FormikProps } from 'formik';
import { MultiValue } from 'react-select';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { Registry } from '@/react/portainer/registries/types/registry';
import { Authorized, useAuthorizations } from '@/react/hooks/useUser';

import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';
import { FormActions } from '@@/form-components/FormActions';
import { SystemBadge } from '@@/Badge/SystemBadge';

import { IngressClassDatatable } from '../../../cluster/ingressClass/IngressClassDatatable';
import { useIngressControllerClassMapQuery } from '../../../cluster/ingressClass/useIngressControllerClassMap';
import { CreateNamespaceFormValues } from '../../CreateView/types';
import { AnnotationsBeTeaser } from '../../../annotations/AnnotationsBeTeaser';
import { isDefaultNamespace } from '../../isDefaultNamespace';
import { useIsSystemNamespace } from '../../queries/useIsSystemNamespace';

import { NamespaceSummary } from './NamespaceSummary';
import { StorageQuotaFormSection } from './StorageQuotaFormSection/StorageQuotaFormSection';
import { RegistriesFormSection } from './RegistriesFormSection';
import { ResourceQuotaFormValues } from './ResourceQuotaFormSection/types';
import { ResourceQuotaFormSection } from './ResourceQuotaFormSection';
import { LoadBalancerFormSection } from './LoadBalancerFormSection';
import { ToggleSystemNamespaceButton } from './ToggleSystemNamespaceButton';

const namespaceWriteAuth = 'K8sResourcePoolDetailsW';

export function NamespaceInnerForm({
  errors,
  isValid,
  dirty,
  setFieldValue,
  values,
  isUpdating,
  initialValues,
  isEdit,
}: FormikProps<CreateNamespaceFormValues> & {
  isEdit?: boolean;
  isUpdating: boolean;
}) {
  const { authorized: hasNamespaceWriteAuth } = useAuthorizations(
    namespaceWriteAuth,
    undefined,
    true
  );
  const isSystemNamespace = useIsSystemNamespace(values.name, isEdit === true);
  const isEditingDisabled =
    !hasNamespaceWriteAuth ||
    isDefaultNamespace(values.name) ||
    isSystemNamespace;
  const environmentId = useEnvironmentId();
  const environmentQuery = useCurrentEnvironment();
  const ingressClassesQuery = useIngressControllerClassMapQuery({
    environmentId,
    namespace: values.name,
    allowedOnly: true,
  });

  if (environmentQuery.isLoading) {
    return null;
  }

  const useLoadBalancer =
    environmentQuery.data?.Kubernetes.Configuration.UseLoadBalancer;
  const enableResourceOverCommit =
    environmentQuery.data?.Kubernetes.Configuration.EnableResourceOverCommit;
  const enableIngressControllersPerNamespace =
    environmentQuery.data?.Kubernetes.Configuration
      .IngressAvailabilityPerNamespace;
  const storageClasses =
    environmentQuery.data?.Kubernetes.Configuration.StorageClasses ?? [];

  return (
    <Form className="form-horizontal">
      <FormControl
        inputId="namespace"
        label="名称"
        required={!isEdit}
        errors={errors.name}
      >
        {isEdit ? (
          <div className="mt-2 flex gap-2">
            {values.name}
            {isSystemNamespace && <SystemBadge />}
          </div>
        ) : (
          <Field
            as={Input}
            id="namespace"
            name="name"
            disabled={isEdit}
            placeholder="例如 my-namespace"
            data-cy="k8sNamespaceCreate-namespaceNameInput"
          />
        )}
      </FormControl>
      <AnnotationsBeTeaser />
      {(values.resourceQuota.enabled || !isEditingDisabled) && (
        <ResourceQuotaFormSection
          isEdit={isEdit}
          enableResourceOverCommit={enableResourceOverCommit}
          values={values.resourceQuota}
          onChange={(resourceQuota: ResourceQuotaFormValues) =>
            setFieldValue('resourceQuota', resourceQuota)
          }
          errors={errors.resourceQuota}
          namespaceName={values.name}
          isEditingDisabled={isEditingDisabled}
        />
      )}
      {useLoadBalancer && <LoadBalancerFormSection />}
      {enableIngressControllersPerNamespace && (
        <Authorized authorizations={[namespaceWriteAuth]}>
            <FormSection title="网络">
            <IngressClassDatatable
              onChange={(classes) => setFieldValue('ingressClasses', classes)}
              values={values.ingressClasses}
               description="启用用户在此命名空间中发布应用时可选择的 ingress controller。"
               noIngressControllerLabel="集群中没有可用的 ingress controller。前往集群设置页面进行配置，并允许在集群中使用 ingress controller。"
              view="namespace"
              isLoading={ingressClassesQuery.isLoading}
              initialValues={initialValues.ingressClasses}
            />
          </FormSection>
        </Authorized>
      )}
      <RegistriesFormSection
        values={values.registries}
        onChange={(registries: MultiValue<Registry>) =>
          setFieldValue('registries', registries)
        }
        errors={errors.registries}
        isEditingDisabled={isEditingDisabled}
      />
      {storageClasses.length > 0 && (
        <StorageQuotaFormSection storageClasses={storageClasses} />
      )}
      <Authorized authorizations={[namespaceWriteAuth]}>
        <NamespaceSummary
          initialValues={initialValues}
          values={values}
          isValid={isValid}
        />
        <FormActions
          submitLabel={isEdit ? '更新命名空间' : '创建命名空间'}
          loadingText={isEdit ? '正在更新命名空间' : '正在创建命名空间'}
          isLoading={isUpdating}
          isValid={isValid && dirty}
          data-cy="k8sNamespaceCreate-submitButton"
        >
          {isEdit && (
            <ToggleSystemNamespaceButton
              isSystemNamespace={isSystemNamespace}
              isEdit={isEdit}
              environmentId={environmentId}
              namespaceName={values.name}
            />
          )}
        </FormActions>
      </Authorized>
    </Form>
  );
}
