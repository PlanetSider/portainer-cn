import { Plus, RefreshCw } from 'lucide-react';
import { FormikErrors } from 'formik';

import { useIsEdgeAdmin } from '@/react/hooks/useUser';
import { useEnvironment } from '@/react/portainer/environments/queries';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { Card } from '@@/primitives/Card';
import { TextTip } from '@@/Tip/TextTip';
import { Button } from '@@/buttons';
import { FormError } from '@@/form-components/FormError';
import { Link } from '@@/Link';

import {
  generateUniqueName,
  newPort,
  serviceFormDefaultValues,
} from '../utils';
import { ServiceFormValues, ServicePort } from '../types';

import { LoadBalancerServiceForm } from './LoadBalancerServiceForm';

interface Props {
  services: ServiceFormValues[];
  onChangeService: (services: ServiceFormValues[]) => void;
  errors?: FormikErrors<ServiceFormValues[]>;
  appName: string;
  selector: Record<string, string>;
  namespace?: string;
  isEditMode?: boolean;
}

export function LoadBalancerServicesForm({
  services,
  onChangeService,
  errors,
  appName,
  selector,
  namespace,
  isEditMode,
}: Props) {
  const isAdminQuery = useIsEdgeAdmin();

  const environmentId = useEnvironmentId();
  const { data: loadBalancerEnabled, ...loadBalancerEnabledQuery } =
    useEnvironment(
      environmentId,
      (environment) => environment?.Kubernetes.Configuration.UseLoadBalancer
    );

  if (isAdminQuery.isLoading) {
    return null;
  }

  const { isAdmin } = isAdminQuery;

  const loadBalancerServiceCount = services.filter(
    (service) => service.Type === 'LoadBalancer'
  ).length;
  return (
    <Card.Container variant="filled">
      <Card.Body className="pb-5">
        <div className="flex flex-col gap-6">
          <TextTip color="blue">
            通过 <b>LoadBalancer Service</b> 允许访问集群<b>外部</b>的流量。
            如果运行在云平台上，将自动配置云负载均衡器。
          </TextTip>
          {!loadBalancerEnabled && loadBalancerEnabledQuery.isSuccess && (
            <div className="flex flex-col">
              <FormError>
                {isAdmin ? (
                  <>
                    此集群当前未启用负载均衡器。请通过{' '}
                    <Link
                      to="kubernetes.cluster.setup"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cy="k8sAppCreate-clusterSetupLink"
                    >
                      集群设置
                    </Link>{' '}
                    ，然后刷新此标签页
                  </>
                ) : (
                  '此集群当前未启用负载均衡器，请联系管理员。'
                )}
              </FormError>
              <div className="flex">
                <Button
                  icon={RefreshCw}
                  data-cy="k8sAppCreate-refreshLoadBalancerButton"
                  color="default"
                  className="!ml-0"
                  onClick={() => loadBalancerEnabledQuery.refetch()}
                >
                  刷新
                </Button>
              </div>
            </div>
          )}
          {loadBalancerServiceCount > 0 && (
            <div className="flex w-full flex-col gap-4">
              {services.map((service, index) =>
                service.Type === 'LoadBalancer' ? (
                  <LoadBalancerServiceForm
                    key={index}
                    serviceName={service.Name}
                    servicePorts={service.Ports}
                    errors={errors?.[index]?.Ports}
                    onChangePort={(servicePorts: ServicePort[]) => {
                      const newServices = [...services];
                      newServices[index].Ports = servicePorts;
                      onChangeService(newServices);
                    }}
                    services={services}
                    serviceIndex={index}
                    onChangeService={onChangeService}
                    namespace={namespace}
                    isEditMode={isEditMode}
                  />
                ) : null
              )}
            </div>
          )}
          <div className="flex">
            <Button
              color="secondary"
              className="!ml-0"
              icon={Plus}
              size="small"
              onClick={() => {
                // create a new service form value and add it to the list of services
                const newService = structuredClone(serviceFormDefaultValues);
                newService.Name = generateUniqueName(
                  appName,
                  services.length + 1,
                  services
                );
                newService.Type = 'LoadBalancer';
                const newServicePort = newPort(newService.Name);
                newService.Ports = [newServicePort];
                newService.Selector = selector;
                onChangeService([...services, newService]);
              }}
              disabled={!loadBalancerEnabled}
              data-cy="k8sAppCreate-createServiceButton"
            >
              创建服务
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card.Container>
  );
}
