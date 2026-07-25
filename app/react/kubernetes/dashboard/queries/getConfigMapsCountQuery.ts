import { useQuery } from '@tanstack/react-query';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

const queryKeys = {
  list: (environmentId: EnvironmentId) =>
    ['environments', environmentId, 'dashboard', 'configMapsCount'] as const,
};

export function useGetConfigMapsCountQuery(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getConfigMapsCount(environmentId),
    {
      ...withError('无法获取 ConfigMap 数量'),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
    }
  );
}

async function getConfigMapsCount(environmentId: EnvironmentId) {
  try {
    const { data: configMapsCount } = await axios.get<number>(
      `kubernetes/${environmentId}/configmaps/count`
    );

    return configMapsCount;
  } catch (e) {
    throw parseAxiosError(
      e,
      '无法获取仪表盘统计信息，部分数量可能不准确。'
    );
  }
}
