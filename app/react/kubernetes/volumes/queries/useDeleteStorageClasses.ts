import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';
import { notifySuccess } from '@/portainer/services/notifications';
import { StorageClass } from '@/react/kubernetes/volumes/ListView/types';

import { queryKeys } from './query-keys';

export function useDeleteStorageClasses(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storageClasses: StorageClass[]) =>
      deleteStorageClasses(storageClasses, environmentId),
    onSuccess: () => {
      notifySuccess('成功', '存储类已删除');
      queryClient.invalidateQueries(queryKeys.storages(environmentId));
      return queryClient.invalidateQueries(queryKeys.volumes(environmentId));
    },
    ...withError('无法删除存储类'),
  });
}

function deleteStorageClasses(
  storageClasses: StorageClass[],
  environmentId: EnvironmentId
) {
  return axios.post(
    `/kubernetes/${environmentId}/storage_classes/delete`,
    storageClasses.map((s) => s.name)
  );
}
