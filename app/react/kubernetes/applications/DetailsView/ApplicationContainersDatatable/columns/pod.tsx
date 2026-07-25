import { createColumnHelper } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Authorized } from '@/react/hooks/useUser';
import { formatDate } from '@/portainer/filters/filters';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';
import { Link } from '@@/Link';
import { Icon } from '@@/Icon';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { LoadingButton } from '@@/buttons';
import { confirmDelete } from '@@/modals/confirm';

import { PodRowData } from '../types';

const columnHelper = createColumnHelper<PodRowData>();

const pod = columnHelper.accessor('podName', {
  header: 'Pod',
  id: 'podName',
  cell: ({ row: { original: podRow } }) => {
    const statusData = podRow.status;
    return (
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate" title={podRow.podName}>
          {podRow.podName}
        </span>
        <Badge type={statusData.type}>
          <span>
            {statusData.status}
            {statusData.restartCount
              ? `（已重启 ${statusData.restartCount} 次）`
              : ''}
          </span>
          {statusData.message && <Tooltip message={statusData.message} />}
        </Badge>
      </div>
    );
  },
});

const node = columnHelper.accessor('nodeName', {
  header: '节点',
  cell: ({ getValue }) => {
    const nodeName = getValue();
    return (
      <Authorized
        authorizations="K8sClusterNodeR"
        childrenUnauthorized={nodeName}
      >
        <Link
          to="kubernetes.cluster.node"
          params={{ nodeName }}
          data-cy={`application-container-node-${nodeName}`}
        >
          <div className="max-w-xs truncate" title={nodeName}>
            {nodeName}
          </div>
        </Link>
      </Authorized>
    );
  },
});

const podIp = columnHelper.accessor('podIp', {
  header: 'Pod IP',
  id: 'podIp',
});

const containers = columnHelper.accessor(
  (row) => `${row.readyContainers}/${row.totalContainers}`,
  {
    id: 'containers',
    header: '容器',
    enableSorting: false,
  }
);

const creationDate = columnHelper.accessor(
  (row) => formatDate(row.creationDate),
  {
    header: '创建时间',
    cell: ({ getValue }) => getValue(),
  }
);

export const podColumns = [pod, node, podIp, containers, creationDate];

interface PodColumnsOptions {
  supportsRestartStrategy: boolean;
  onDelete: (podName: string) => void;
  isDeleting: boolean;
  isLoading: boolean;
}

export function getPodColumns({
  supportsRestartStrategy,
  onDelete,
  isDeleting,
  isLoading,
}: PodColumnsOptions) {
  const deleteTooltip = supportsRestartStrategy
    ? '删除 Pod。如果此 Pod 配置了 RestartAllContainers 重启策略，容器将自动原地重启。'
    : '删除 Pod';

  const actions = columnHelper.display({
    id: 'actions',
    header: '操作',
    cell: ({ row: { original: podRow } }) => (
      <Authorized authorizations="K8sApplicationsP">
        <div className="flex gap-x-2">
          <TooltipWithChildren message={deleteTooltip} position="top">
            <LoadingButton
              color="dangerlight"
              className="!ml-0"
              aria-label={`删除 Pod ${podRow.podName}`}
              isLoading={isLoading || isDeleting}
              loadingText="加载中"
              data-cy={`application-pod-delete-${podRow.podName}`}
              onClick={async () => {
                const confirmed = await confirmDelete(
                  `确定要删除 Pod '${podRow.podName}' 吗？Kubernetes 将重新调度一个新 Pod 来替代它。`
                );
                if (!confirmed) {
                  return;
                }
                onDelete(podRow.podName);
              }}
            >
              <Icon icon={Trash2} />
            </LoadingButton>
          </TooltipWithChildren>
        </div>
      </Authorized>
    ),
  });

  return [pod, node, podIp, containers, creationDate, actions];
}
