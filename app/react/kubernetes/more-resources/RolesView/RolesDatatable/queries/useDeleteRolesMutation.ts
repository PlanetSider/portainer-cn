import { useMutation, useQueryClient } from '@tanstack/react-query';

import { withError, withInvalidate } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { queryKeys } from './query-keys';

export function useDeleteRolesMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation(deleteRole, {
    ...withInvalidate(queryClient, [queryKeys.list(environmentId)]),
    ...withError('无法删除角色'),
  });
}

export async function deleteRole({
  environmentId,
  data,
}: {
  environmentId: EnvironmentId;
  data: Record<string, string[]>;
}) {
  try {
    return await axios.post(`kubernetes/${environmentId}/roles/delete`, data);
  } catch (e) {
    throw parseAxiosError(e, '无法删除角色');
  }
}
