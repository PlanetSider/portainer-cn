import { useQuery } from '@tanstack/react-query';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

const queryKeys = {
  list: (environmentId: EnvironmentId) =>
    ['environments', environmentId, 'dashboard', 'ingressesCount'] as const,
};

export function useGetIngressesCountQuery(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getIngressesCount(environmentId),
    {
      ...withError('无法获取 Ingress 数量'),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
    }
  );
}

async function getIngressesCount(environmentId: EnvironmentId) {
  try {
    const { data: ingressesCount } = await axios.get<number>(
      `kubernetes/${environmentId}/ingresses/count`
    );

    return ingressesCount;
  } catch (e) {
    throw parseAxiosError(
      e,
      '无法获取仪表盘统计信息，部分数量可能不准确。'
    );
  }
}
