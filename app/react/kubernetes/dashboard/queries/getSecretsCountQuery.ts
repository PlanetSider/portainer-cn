import { useQuery } from '@tanstack/react-query';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

const queryKeys = {
  list: (environmentId: EnvironmentId) =>
    ['environments', environmentId, 'dashboard', 'secretsCount'] as const,
};

export function useGetSecretsCountQuery(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getSecretsCount(environmentId),
    {
      ...withError('无法获取 Secret 数量'),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
    }
  );
}

async function getSecretsCount(environmentId: EnvironmentId) {
  try {
    const { data: secretsCount } = await axios.get<number>(
      `kubernetes/${environmentId}/secrets/count`
    );

    return secretsCount;
  } catch (e) {
    throw parseAxiosError(
      e,
      '无法获取仪表盘统计信息，部分数量可能不准确。'
    );
  }
}
