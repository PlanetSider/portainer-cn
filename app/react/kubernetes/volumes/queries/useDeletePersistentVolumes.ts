import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';
import { notifySuccess } from '@/portainer/services/notifications';
import { PersistentVolume } from '@/react/kubernetes/volumes/ListView/types';

import { queryKeys } from './query-keys';

export function useDeletePersistentVolumes(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (volumes: PersistentVolume[]) =>
      deleteVolumes(volumes, environmentId),
    onSuccess: () => {
      notifySuccess('成功', '持久卷已删除');
      queryClient.invalidateQueries(queryKeys.storages(environmentId));
      return queryClient.invalidateQueries(queryKeys.volumes(environmentId));
    },
    ...withError('无法删除持久卷'),
  });
}

function deleteVolumes(
  volumes: PersistentVolume[],
  environmentId: EnvironmentId
) {
  return axios.post(
    `/kubernetes/${environmentId}/persistent_volumes/delete`,
    volumes.map((v) => v.name)
  );
}
