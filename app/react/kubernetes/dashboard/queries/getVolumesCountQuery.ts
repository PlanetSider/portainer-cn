import { useQuery } from '@tanstack/react-query';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

const queryKeys = {
  list: (environmentId: EnvironmentId) =>
    ['environments', environmentId, 'dashboard', 'volumesCount'] as const,
};

export function useGetVolumesCountQuery(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getVolumesCount(environmentId),
    {
      ...withError('无法获取存储卷数量'),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
    }
  );
}

async function getVolumesCount(environmentId: EnvironmentId) {
  try {
    const { data: volumesCount } = await axios.get<number>(
      `kubernetes/${environmentId}/volumes/count`
    );

    return volumesCount;
  } catch (e) {
    throw parseAxiosError(
      e,
      '无法获取仪表盘统计信息，部分数量可能不准确。'
    );
  }
}
