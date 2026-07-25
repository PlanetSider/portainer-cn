import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';
import { notifySuccess } from '@/portainer/services/notifications';
import { parseKubernetesAxiosError } from '@/react/kubernetes/axiosError';

import { queryKeys } from './query-keys';

export function useSetDefaultStorageClass(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => setDefaultStorageClass(name, environmentId),
    onSuccess: () => {
      notifySuccess('成功', '默认存储类已更新');
      return queryClient.invalidateQueries(queryKeys.storages(environmentId));
    },
    ...withError('无法设置默认存储类'),
  });
}

async function setDefaultStorageClass(
  name: string,
  environmentId: EnvironmentId
) {
  try {
    await axios.put(
      `/kubernetes/${environmentId}/storage_classes/${encodeURIComponent(
        name
      )}/default`
    );
  } catch (e) {
    throw parseKubernetesAxiosError(e, '无法设置默认存储类');
  }
}
