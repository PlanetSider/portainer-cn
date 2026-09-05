import { EndpointsList } from 'kubernetes-types/core/v1';
import { useQuery } from '@tanstack/react-query';

import axios from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { withError } from '@/react-tools/react-query';

import { parseKubernetesAxiosError } from '../axiosError';

async function getKubernetesEndpoints(environmentId: EnvironmentId) {
  try {
    const { data: endpointsList } = await axios.get<EndpointsList>(
      `/endpoints/${environmentId}/kubernetes/api/v1/endpoints`
    );
    return endpointsList.items;
  } catch (e) {
    throw parseKubernetesAxiosError(e, '无法获取 Kubernetes Endpoint');
  }
}

export function useKubernetesEndpointsQuery(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    ['environments', environmentId, 'kubernetes', 'endpoints'],
    () => getKubernetesEndpoints(environmentId),
    {
      ...withError('无法获取 Kubernetes Endpoint'),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
    }
  );
}
