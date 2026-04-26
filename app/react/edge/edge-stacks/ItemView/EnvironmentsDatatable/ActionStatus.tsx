import { useCurrentStateAndParams } from '@uirouter/react';

import { EnvironmentId } from '@/react/portainer/environments/types';

import { useLogsStatus } from './useLogsStatus';

interface Props {
  environmentId: EnvironmentId;
}

export function ActionStatus({ environmentId }: Props) {
  const {
    params: { stackId: edgeStackId },
  } = useCurrentStateAndParams();

  const logsStatusQuery = useLogsStatus(edgeStackId, environmentId);

  return <>{getStatusText(logsStatusQuery.data)}</>;
}

function getStatusText(status?: 'pending' | 'collected' | 'idle') {
  switch (status) {
    case 'collected':
      return '日志已可供下载';
    case 'pending':
      return '日志已标记为收集，请等待日志可用后再下载';
    default:
      return null;
  }
}
