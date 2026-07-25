import { useQuery } from '@tanstack/react-query';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { ServiceAccount } from '../../types';

import { queryKeys } from './query-keys';

export function useGetAllServiceAccountsQuery(
  environmentId: EnvironmentId,
  options?: {
    refetchInterval?: number;
    enabled?: boolean;
  }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getAllServiceAccounts(environmentId),
    {
      ...withError('无法获取 ServiceAccount'),
      ...options,
    }
  );
}

async function getAllServiceAccounts(environmentId: EnvironmentId) {
  try {
    const { data: services } = await axios.get<ServiceAccount[]>(
      `kubernetes/${environmentId}/service_accounts`
    );

    return services;
  } catch (e) {
    throw parseAxiosError(e, '无法获取 ServiceAccount');
  }
}
