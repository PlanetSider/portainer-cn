import { useQuery } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import PortainerError from '@/portainer/error';
import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';

import { IngressControllerClassMapRowData } from './types';

export function useIngressControllerClassMapQuery({
  environmentId,
  namespace,
  allowedOnly,
}: {
  environmentId?: EnvironmentId;
  namespace?: string;
  allowedOnly?: boolean;
}) {
  return useQuery(
    [
      'environments',
      environmentId,
      'ingresscontrollers',
      namespace,
      allowedOnly,
    ],
    () => {
      if (!environmentId) {
        return [];
      }
      return getIngressControllerClassMap({
        environmentId,
        namespace,
        allowedOnly,
      });
    },
    {
      ...withError('失败', '无法获取 Ingress Controller。'),
      enabled: !!environmentId,
    }
  );
}

// get all supported ingress classes and controllers for the cluster
// allowedOnly set to true will hide globally disallowed ingresscontrollers
export async function getIngressControllerClassMap({
  environmentId,
  namespace,
  allowedOnly,
}: {
  environmentId: EnvironmentId;
  namespace?: string;
  allowedOnly?: boolean;
}) {
  try {
    const { data: controllerMaps } = await axios.get<
      IngressControllerClassMapRowData[]
    >(
      buildUrl(environmentId, namespace),
      allowedOnly ? { params: { allowedOnly: true } } : undefined
    );
    return controllerMaps;
  } catch (e) {
    throw new PortainerError('无法获取 Ingress Controller。', e as Error);
  }
}

// get all supported ingress classes and controllers for the cluster
export async function updateIngressControllerClassMap(
  environmentId: EnvironmentId,
  ingressControllerClassMap: IngressControllerClassMapRowData[],
  namespace?: string
) {
  try {
    const { data: controllerMaps } = await axios.put<
      IngressControllerClassMapRowData[]
    >(buildUrl(environmentId, namespace), ingressControllerClassMap);
    return controllerMaps;
  } catch (e) {
    throw new PortainerError(
      '无法更新 Ingress Controller。',
      e as Error
    );
  }
}

function buildUrl(environmentId: EnvironmentId, namespace?: string) {
  let url = `kubernetes/${environmentId}/`;
  if (namespace) {
    url += `namespaces/${namespace}/`;
  }
  url += 'ingresscontrollers';
  return url;
}
