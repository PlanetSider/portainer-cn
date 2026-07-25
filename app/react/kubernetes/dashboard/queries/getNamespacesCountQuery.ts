import { useQuery } from '@tanstack/react-query';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

const queryKeys = {
  list: (environmentId: EnvironmentId) =>
    ['environments', environmentId, 'dashboard', 'namespacesCount'] as const,
};

export function useGetNamespacesCountQuery(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getNamespacesCount(environmentId),
    {
      ...withError('无法获取命名空间数量'),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
    }
  );
}

async function getNamespacesCount(environmentId: EnvironmentId) {
  try {
    const { data: namespacesCount } = await axios.get<number>(
      `kubernetes/${environmentId}/namespaces/count`
    );

    return namespacesCount;
  } catch (e) {
    throw parseAxiosError(
      e,
      '无法获取仪表盘统计信息，部分数量可能不准确。'
    );
  }
}
