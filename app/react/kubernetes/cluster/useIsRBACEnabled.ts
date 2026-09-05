import { useQuery } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { withError } from '@/react-tools/react-query';

export function useIsRBACEnabled(environmentId: EnvironmentId) {
  return useQuery<boolean, Error>(
    ['environments', environmentId, 'rbacEnabled'],
    () => getIsRBACEnabled(environmentId),
    {
      enabled: !!environmentId,
      ...withError('无法检查 RBAC 是否已启用。'),
    }
  );
}

async function getIsRBACEnabled(environmentId: EnvironmentId) {
  try {
    const { data } = await axios.get<boolean>(
      `kubernetes/${environmentId}/rbac_enabled`
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e, '无法检查 RBAC 是否已启用。');
  }
}
