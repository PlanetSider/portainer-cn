import { ChangeEvent, useEffect } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';

import Route from '@/assets/ico/route.svg?c';

import { Link } from '@@/Link';
import { Option } from '@@/form-components/Input/Select';
import { FormError } from '@@/form-components/FormError';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { Tooltip } from '@@/Tip/Tooltip';
import { Button } from '@@/buttons';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { TextTip } from '@@/Tip/TextTip';
import { InlineLoader } from '@@/InlineLoader';
import { Select } from '@@/form-components/ReactSelect';
import { Card } from '@@/Card';
import { InputGroup } from '@@/form-components/InputGroup';
import { Input } from '@@/form-components/Input';

import { AnnotationsForm } from '../../annotations/AnnotationsForm';

import {
  GroupedServiceOptions,
  IngressErrors,
  Rule,
  ServicePorts,
} from './types';

import '../style.css';

const PathTypes: Record<string, string[]> = {
  nginx: ['ImplementationSpecific', 'Prefix', 'Exact'],
  traefik: ['Prefix', 'Exact'],
  other: ['Prefix', 'Exact'],
};
const PlaceholderAnnotations: Record<string, string[]> = {
  nginx: ['e.g. nginx.ingress.kubernetes.io/rewrite-target', '/$1'],
  traefik: ['e.g. traefik.ingress.kubernetes.io/router.tls', 'true'],
  other: ['e.g. app.kubernetes.io/name', 'examplename'],
};

interface Props {
  environmentID: number;
  rule: Rule;

  errors: IngressErrors;
  isEdit: boolean;
  namespace: string;

  servicePorts: ServicePorts;
  ingressClassOptions: Option<string>[];
  isIngressClassOptionsLoading: boolean;
  serviceOptions: GroupedServiceOptions;
  tlsOptions: Option<string>[];
  namespacesOptions: Option<string>[];
  isNamespaceOptionsLoading: boolean;
  isIngressNamesLoading: boolean;

  removeIngressRoute: (hostIndex: number, pathIndex: number) => void;
  removeIngressHost: (hostIndex: number) => void;
  removeAnnotation: (index: number) => void;

  addNewIngressHost: (noHost?: boolean) => void;
  addNewIngressRoute: (hostIndex: number) => void;
  addNewAnnotation: (type?: 'rewrite' | 'regex' | 'ingressClass') => void;

  handleNamespaceChange: (val: string) => void;
  handleHostChange: (hostIndex: number, val: string) => void;
  handleTLSChange: (hostIndex: number, tls: string) => void;
  handleIngressChange: (
    key: 'IngressName' | 'IngressClassName',
    value: string
  ) => void;
  handleAnnotationChange: (
    index: number,
    key: 'key' | 'value',
    val: string
  ) => void;
  handlePathChange: (
    hostIndex: number,
    pathIndex: number,
    key: 'Route' | 'PathType' | 'ServiceName' | 'ServicePort',
    val: string
  ) => void;

  reloadTLSCerts: () => void;
}

export function IngressForm({
  environmentID,
  rule,
  isEdit,
  servicePorts,
  tlsOptions,
  handleTLSChange,
  addNewIngressHost,
  serviceOptions,
  handleHostChange,
  handleIngressChange,
  handlePathChange,
  addNewIngressRoute,
  removeIngressRoute,
  removeIngressHost,
  addNewAnnotation,
  removeAnnotation,
  reloadTLSCerts,
  handleAnnotationChange,
  ingressClassOptions,
  isIngressClassOptionsLoading,
  errors,
  namespacesOptions,
  isNamespaceOptionsLoading,
  isIngressNamesLoading,
  handleNamespaceChange,
  namespace,
}: Props) {
  const hasNoHostRule = rule.Hosts?.some((host) => host.NoHost);
  const placeholderAnnotation =
    PlaceholderAnnotations[rule.IngressType || 'other'] ||
    PlaceholderAnnotations.other;
  const pathTypes = PathTypes[rule.IngressType || 'other'] || PathTypes.other;

  // when the namespace options update the value to an available one
  useEffect(() => {
    const namespaces = namespacesOptions.map((option) => option.value);
    if (
      !isEdit &&
      !namespaces.includes(namespace) &&
      namespaces.length > 0 &&
      !isIngressNamesLoading
    ) {
      handleNamespaceChange(namespaces[0]);
    }
  }, [
    namespacesOptions,
    namespace,
    handleNamespaceChange,
    isNamespaceOptionsLoading,
    isEdit,
    isIngressNamesLoading,
  ]);

  return (
    <Widget>
      <WidgetTitle icon={Route} title="Ingress" />
      <WidgetBody key={rule.Key + rule.Namespace}>
        <div className="row">
          <div className="form-horizontal">
            <div className="form-group">
              <label
                className="control-label text-muted col-sm-3 col-lg-2"
                htmlFor="namespace"
              >
                命名空间
              </label>
              {isNamespaceOptionsLoading && (
                <div className="col-sm-4">
                  <InlineLoader className="pt-2">
                    正在加载命名空间...
                  </InlineLoader>
                </div>
              )}
              {!isNamespaceOptionsLoading && (
                <div className={`col-sm-4 ${isEdit && 'control-label'}`}>
                  {isEdit ? (
                    namespace
                  ) : (
                    <Select
                      name="namespaces"
                      options={namespacesOptions}
                      value={
                        namespace
                          ? { value: namespace, label: namespace }
                          : null
                      }
                      isDisabled={isEdit}
                      onChange={(val) =>
                        handleNamespaceChange(val?.value || '')
                      }
                      placeholder={
                        namespacesOptions.length
                          ? '选择命名空间'
                          : '没有可用命名空间'
                      }
                      noOptionsMessage={() => '没有可用命名空间'}
                      data-cy="k8sAppCreate-namespaceSelect"
                      id="k8sAppCreate-namespaceSelect"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {namespace && (
          <div className="row">
            <div className="form-horizontal">
              <div className="form-group">
                <label
                  className="control-label text-muted col-sm-3 col-lg-2 required"
                  htmlFor="ingress_name"
                >
                  Ingress 名称
                </label>
                <div className="col-sm-4">
                  {isEdit ? (
                    rule.IngressName
                  ) : (
                    <Input
                      name="ingress_name"
                      type="text"
                      className="form-control"
                      placeholder="Ingress 名称"
                      defaultValue={rule.IngressName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleIngressChange('IngressName', e.target.value)
                      }
                      disabled={isEdit}
                      data-cy="k8sAppCreate-ingressNameInput"
                    />
                  )}
                  {errors.ingressName && !isEdit && (
                    <FormError className="error-inline mt-1">
                      {errors.ingressName}
                    </FormError>
                  )}
                </div>
              </div>

              <div className="form-group" key={ingressClassOptions.toString()}>
                <label
                  className="control-label text-muted col-sm-3 col-lg-2 required"
                  htmlFor="ingress_class"
                >
                  Ingress Class
                </label>
                <div className="col-sm-4">
                  {isIngressClassOptionsLoading && (
                    <InlineLoader className="pt-2">
                      正在加载 ingress class...
                    </InlineLoader>
                  )}
                  {!isIngressClassOptionsLoading && (
                    <>
                      <Select
                        name="ingress_class"
                        placeholder={
                          ingressClassOptions.length
                            ? '选择 ingress class'
                            : '没有可用 ingress class'
                        }
                        options={ingressClassOptions}
                        value={
                          rule.IngressClassName
                            ? {
                                label: rule.IngressClassName,
                                value: rule.IngressClassName,
                              }
                            : null
                        }
                        onChange={(ingressClassOption) =>
                          handleIngressChange(
                            'IngressClassName',
                            ingressClassOption?.value || ''
                          )
                        }
                        noOptionsMessage={() => '没有可用 ingress class'}
                        data-cy="k8sAppCreate-ingressClassSelect"
                        id="k8sAppCreate-ingressClassSelect"
                      />
                      {errors.className && (
                        <FormError className="error-inline mt-1">
                          {errors.className}
                        </FormError>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-12 text-muted !mb-0 px-0">
              <div className="control-label !mb-3 text-left font-medium">
                注解
                <Tooltip
                  message={
                    <div className="vertical-center">
                      <span>
                        允许为对象指定{' '}
                        <a
                          href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/"
                          target="_black"
                        >
                          annotations
                        </a>{' '}
                        。更多信息请参考 Kubernetes 文档中的{' '}
                        <a
                          href="https://kubernetes.io/docs/reference/labels-annotations-taints/"
                          target="_black"
                        >
                          well-known annotations
                        </a>
                        .
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {rule?.Annotations && (
              <AnnotationsForm
                placeholder={placeholderAnnotation}
                annotations={rule.Annotations}
                handleAnnotationChange={handleAnnotationChange}
                removeAnnotation={removeAnnotation}
                errors={errors.annotations}
              />
            )}

            <div className="col-sm-12 anntation-actions p-0">
              <TooltipWithChildren message="使用注解来配置 Ingress 选项。请查阅 Nginx 或 Traefik 文档，了解所选 ingress 类型支持的注解。">
                <span>
                  <Button
                    className="btn btn-sm btn-light !ml-0 mb-2"
                    data-cy="add-annotation-button"
                    onClick={() => addNewAnnotation()}
                    icon={Plus}
                  >
                    {' '}
                    添加注解
                  </Button>
                </span>
              </TooltipWithChildren>

              {rule.IngressType === 'nginx' && (
                <>
                  <TooltipWithChildren message="当应用的暴露 URL 与 Ingress 中指定的路径不一致时，可使用 rewrite target 注解来指定重定向路径。">
                    <span>
                      <Button
                        className="btn btn-sm btn-light mb-2 ml-2"
                        onClick={() => addNewAnnotation('rewrite')}
                        icon={Plus}
                        data-cy="add-rewrite-annotation"
                      >
                        添加 rewrite 注解
                      </Button>
                    </span>
                  </TooltipWithChildren>

                  <TooltipWithChildren message="在 Ingress 路径中启用正则表达式（可在应用的 ingress 详情中设置）。通常与 rewrite-target 配合使用，以指定要替换的正则捕获组。">
                    <span>
                      <Button
                        className="btn btn-sm btn-light mb-2 ml-2"
                        onClick={() => addNewAnnotation('regex')}
                        icon={Plus}
                        data-cy="add-regex-annotation"
                      >
                        添加正则表达式注解
                      </Button>
                    </span>
                  </TooltipWithChildren>
                </>
              )}

              {rule.IngressType === 'custom' && (
                <Button
                  className="btn btn-sm btn-light mb-2 ml-2"
                  onClick={() => addNewAnnotation('ingressClass')}
                  icon={Plus}
                  data-cy="add-ingress-class-annotation"
                >
                  添加 kubernetes.io/ingress.class 注解
                </Button>
              )}
            </div>

            <div className="col-sm-12 text-muted px-0">规则</div>
          </div>
        )}

        {namespace &&
          rule?.Hosts?.map((host, hostIndex) => (
            <Card key={host.Key} className="mb-5">
              <div className="flex flex-col">
                <div className="row rule-actions">
                  <div className="col-sm-3 p-0">
                    {!host.NoHost ? '规则' : '回退规则'}
                  </div>
                  <div className="col-sm-9 p-0 text-right">
                    <Button
                      className="btn btn-sm ml-2"
                      color="dangerlight"
                      type="button"
                      data-cy={`k8sAppCreate-rmHostButton_${hostIndex}`}
                      onClick={() => removeIngressHost(hostIndex)}
                      disabled={rule.Hosts.length === 1}
                      icon={Trash2}
                    >
                      删除规则
                    </Button>
                  </div>
                </div>
                {!host.NoHost && (
                  <div className="row">
                    <div className="form-group col-sm-6 col-lg-4 !pl-0 !pr-2">
                      <InputGroup size="small">
                        <InputGroup.Addon
                          required
                          as="label"
                          htmlFor={`ingress_host_${hostIndex}`}
                        >
                          主机名
                        </InputGroup.Addon>
                        <InputGroup.Input
                          name={`ingress_host_${hostIndex}`}
                          data-cy={`ingress-host_${hostIndex}`}
                          id={`ingress_host_${hostIndex}`}
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="例如：example.com"
                          defaultValue={host.Host}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleHostChange(hostIndex, e.target.value)
                          }
                        />
                      </InputGroup>

                      {errors[`hosts[${hostIndex}].host`] && (
                        <FormError className="!mb-0 mt-1">
                          {errors[`hosts[${hostIndex}].host`]}
                        </FormError>
                      )}
                    </div>

                    <div className="form-group col-sm-6 col-lg-4 !pl-2 !pr-0">
                      <InputGroup size="small">
                        <InputGroup.Addon
                          as="label"
                          htmlFor={`ingress_tls_${hostIndex}`}
                        >
                          TLS Secret
                        </InputGroup.Addon>
                        <Select
                          key={tlsOptions.toString() + host.Secret}
                          name={`ingress_tls_${hostIndex}`}
                          inputId={`ingress_tls_${hostIndex}`}
                          options={tlsOptions}
                          value={
                            host.Secret !== undefined
                              ? {
                                  value: host.Secret,
                                   label: host.Secret || '无 TLS',
                                }
                              : null
                          }
                          onChange={(TLSOption) =>
                            handleTLSChange(hostIndex, TLSOption?.value || '')
                          }
                          placeholder={
                            tlsOptions.length
                               ? '选择 TLS Secret'
                               : '没有可用 TLS Secret'
                          }
                           noOptionsMessage={() => '没有可用 TLS Secret'}
                          size="sm"
                          data-cy={`k8sAppCreate-tlsSelect_${hostIndex}`}
                          id={`k8sAppCreate-tlsSelect_${hostIndex}`}
                        />
                        {!host.NoHost && (
                          <div className="input-group-btn">
                            <Button
                              className="btn btn-light btn-sm !ml-0 !rounded-l-none"
                              onClick={() => reloadTLSCerts()}
                              icon={RefreshCw}
                              data-cy={`k8sAppCreate-tlsRefreshButton_${hostIndex}`}
                            />
                          </div>
                        )}
                      </InputGroup>
                    </div>

                    <div className="col-sm-12 col-lg-4 flex h-[30px] items-center pl-2">
                      <TextTip color="blue">
                        你也可以使用{' '}
                        <Link
                          to="kubernetes.secrets.new"
                          params={{ id: environmentID }}
                          className="text-primary"
                          target="_blank"
                          data-cy={`k8sAppCreate-createSecretLink_${hostIndex}`}
                        >
                          创建 Secret
                        </Link>{' '}
                        功能，然后重新加载下拉框。
                      </TextTip>
                    </div>
                  </div>
                )}
                {host.NoHost && (
                  <TextTip color="blue">
                    回退规则没有指定主机名。只有当传入请求的主机名与其他规则都不匹配时，才会应用此规则。
                  </TextTip>
                )}

                <div className="row">
                  <div className="col-sm-12 text-muted !mb-0 mt-2 px-0">
                    路径
                  </div>
                </div>

                {!host.Paths.length && (
                  <TextTip className="mt-2" color="blue">
                    你可以在不填写路径的情况下保存 Ingress，这样它会成为一个<b>默认 ingress</b>，用户可在创建或编辑应用时通过主机名下拉框选择它。
                  </TextTip>
                )}

                {host.Paths.map((path, pathIndex) => (
                  <div
                    className="row path !mb-5 mt-5"
                    key={`path_${path.Key}}`}
                  >
                    <div className="form-group col-sm-3 col-xl-2 !m-0 !pl-0">
                      <InputGroup size="small">
                        <InputGroup.Addon
                          required
                          as="label"
                          htmlFor={`ingress_service_${hostIndex}_${pathIndex}`}
                        >
                          Service
                        </InputGroup.Addon>
                        <Select
                          key={serviceOptions.toString() + path.ServiceName}
                          name={`ingress_service_${hostIndex}_${pathIndex}`}
                          id={`ingress_service_${hostIndex}_${pathIndex}`}
                          options={serviceOptions}
                          value={
                            path.ServiceName
                              ? {
                                  value: path.ServiceName,
                                  label: getServiceLabel(
                                    serviceOptions,
                                    path.ServiceName
                                  ),
                                }
                              : null
                          }
                          onChange={(serviceOption) =>
                            handlePathChange(
                              hostIndex,
                              pathIndex,
                              'ServiceName',
                              serviceOption?.value || ''
                            )
                          }
                          placeholder={
                            serviceOptions.length
                              ? '选择服务'
                              : '没有可用服务'
                          }
                          noOptionsMessage={() => '没有可用服务'}
                          size="sm"
                          data-cy={`k8sAppCreate-serviceSelect_${hostIndex}_${pathIndex}`}
                        />
                      </InputGroup>
                      {errors[
                        `hosts[${hostIndex}].paths[${pathIndex}].servicename`
                      ] && (
                        <FormError className="error-inline !mb-0 mt-1">
                          {
                            errors[
                              `hosts[${hostIndex}].paths[${pathIndex}].servicename`
                            ]
                          }
                        </FormError>
                      )}
                    </div>

                    <div className="form-group col-sm-2 col-xl-2 !m-0 min-w-[170px] !pl-0">
                      {servicePorts && (
                        <>
                          <InputGroup size="small">
                            <InputGroup.Addon
                              required
                              as="label"
                              htmlFor={`ingress_servicePort_${hostIndex}_${pathIndex}`}
                            >
                              服务端口
                            </InputGroup.Addon>
                            <Select
                              key={servicePorts.toString() + path.ServicePort}
                              name={`ingress_servicePort_${hostIndex}_${pathIndex}`}
                              id={`ingress_servicePort_${hostIndex}_${pathIndex}`}
                              options={
                                servicePorts[path.ServiceName]?.map(
                                  (portOption) => ({
                                    ...portOption,
                                    value: portOption.value.toString(),
                                  })
                                ) || []
                              }
                              onChange={(option) =>
                                handlePathChange(
                                  hostIndex,
                                  pathIndex,
                                  'ServicePort',
                                  option?.value || ''
                                )
                              }
                              value={
                                path.ServicePort
                                  ? {
                                      label: path.ServicePort.toString(),
                                      value: path.ServicePort.toString(),
                                    }
                                  : null
                              }
                              placeholder={
                                servicePorts[path.ServiceName]?.length
                                  ? '选择端口'
                                  : '没有可用端口'
                              }
                              noOptionsMessage={() => '没有可用端口'}
                              size="sm"
                              data-cy={`k8sAppCreate-servicePortSelect_${hostIndex}_${pathIndex}`}
                            />
                          </InputGroup>
                          {errors[
                            `hosts[${hostIndex}].paths[${pathIndex}].serviceport`
                          ] && (
                            <FormError className="!mb-0 mt-1">
                              {
                                errors[
                                  `hosts[${hostIndex}].paths[${pathIndex}].serviceport`
                                ]
                              }
                            </FormError>
                          )}
                        </>
                      )}
                    </div>

                    <div className="form-group col-sm-3 col-xl-2 !m-0 !pl-0">
                      <InputGroup size="small">
                        <InputGroup.Addon
                          as="label"
                          htmlFor={`ingress_pathType_${hostIndex}_${pathIndex}`}
                        >
                          路径类型
                        </InputGroup.Addon>
                        <Select
                          key={servicePorts.toString() + path.PathType}
                          name={`ingress_pathType_${hostIndex}_${pathIndex}`}
                          id={`ingress_pathType_${hostIndex}_${pathIndex}`}
                          options={
                            pathTypes?.map((type) => ({
                              label: type,
                              value: type,
                            })) || []
                          }
                          onChange={(option) =>
                            handlePathChange(
                              hostIndex,
                              pathIndex,
                              'PathType',
                              option?.value || ''
                            )
                          }
                          value={
                            path.PathType
                              ? {
                                  label: path.PathType,
                                  value: path.PathType,
                                }
                              : null
                          }
                          placeholder={
                            pathTypes?.length
                              ? '选择路径类型'
                              : '没有可用路径类型'
                          }
                          noOptionsMessage={() => '没有可用路径类型'}
                          size="sm"
                          data-cy={`k8sAppCreate-pathTypeSelect_${hostIndex}_${pathIndex}`}
                        />
                      </InputGroup>
                      {errors[
                        `hosts[${hostIndex}].paths[${pathIndex}].pathType`
                      ] && (
                        <FormError className="!mb-0 mt-1">
                          {
                            errors[
                              `hosts[${hostIndex}].paths[${pathIndex}].pathType`
                            ]
                          }
                        </FormError>
                      )}
                    </div>

                    <div className="form-group col-sm-3 col-xl-3 !m-0 !pl-0">
                      <InputGroup size="small">
                        <InputGroup.Addon
                          required
                          as="label"
                          htmlFor={`ingress_route_${hostIndex}-${pathIndex}`}
                        >
                          路径
                        </InputGroup.Addon>
                        <InputGroup.Input
                          className="form-control"
                          name={`ingress_route_${hostIndex}-${pathIndex}`}
                          id={`ingress_route_${hostIndex}-${pathIndex}`}
                          placeholder="/example"
                          data-pattern="/^(\/?[a-zA-Z0-9]+([a-zA-Z0-9-/_]*[a-zA-Z0-9])?|[a-zA-Z0-9]+)|(\/){1}$/"
                          data-cy={`k8sAppCreate-route_${hostIndex}-${pathIndex}`}
                          defaultValue={path.Route}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handlePathChange(
                              hostIndex,
                              pathIndex,
                              'Route',
                              e.target.value
                            )
                          }
                        />
                      </InputGroup>
                      {errors[
                        `hosts[${hostIndex}].paths[${pathIndex}].path`
                      ] && (
                        <FormError className="!mb-0 mt-1">
                          {
                            errors[
                              `hosts[${hostIndex}].paths[${pathIndex}].path`
                            ]
                          }
                        </FormError>
                      )}
                    </div>

                    <div className="form-group col-sm-1 !m-0 !pl-0">
                      <Button
                        className="!ml-0 h-[30px]"
                        color="dangerlight"
                        type="button"
                        data-cy={`k8sAppCreate-rmPortButton_${hostIndex}-${pathIndex}`}
                        onClick={() => removeIngressRoute(hostIndex, pathIndex)}
                        icon={Trash2}
                        size="small"
                        disabled={host.Paths.length === 1 && host.NoHost}
                      />
                    </div>
                  </div>
                ))}

                <div className="row mt-5">
                  <Button
                    className="!ml-0"
                    type="button"
                    onClick={() => addNewIngressRoute(hostIndex)}
                    icon={Plus}
                    data-cy={`k8sAppCreate-addPathButton_${hostIndex}`}
                  >
                    添加路径
                  </Button>
                </div>
              </div>
            </Card>
          ))}

        {namespace && (
          <div className="row rules-action p-0">
            <div className="col-sm-12 vertical-center p-0">
              <Button
                className="!ml-0"
                type="button"
                onClick={() => addNewIngressHost()}
                icon={Plus}
                data-cy="k8sAppCreate-addHostButton"
              >
                添加主机
              </Button>

              <Button
                className="ml-2"
                type="button"
                onClick={() => addNewIngressHost(true)}
                disabled={hasNoHostRule}
                icon={Plus}
                data-cy="k8sAppCreate-addFallbackButton"
              >
                添加回退规则
              </Button>
              <Tooltip message="回退规则会应用于所有未匹配任何已定义主机的请求。" />
            </div>
          </div>
        )}
      </WidgetBody>
    </Widget>
  );
}

function getServiceLabel(options: GroupedServiceOptions, value: string) {
  const allOptions = options.flatMap((group) => group.options);
  const option = allOptions.find((o) => o.value === value);
  return option?.selectedLabel || '';
}
