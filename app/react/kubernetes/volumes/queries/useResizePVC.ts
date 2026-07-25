import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EnvironmentId } from '@/react/portainer/environments/types';
import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';
import { notifySuccess } from '@/portainer/services/notifications';

import { queryKeys } from './query-keys';

interface ResizePVCPayload {
  namespace: string;
  name: string;
  newSize: string;
}

export function useResizePVC(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResizePVCPayload) =>
      resizePVC(payload, environmentId),
    onSuccess: () => {
      notifySuccess('成功', '持久卷声明容量已调整');
      return queryClient.invalidateQueries(queryKeys.volumes(environmentId));
    },
    ...withError('无法调整持久卷声明容量'),
  });
}

function resizePVC(payload: ResizePVCPayload, environmentId: EnvironmentId) {
  return axios.put(
    `/kubernetes/${environmentId}/persistent_volume_claims/resize`,
    payload
  );
}
