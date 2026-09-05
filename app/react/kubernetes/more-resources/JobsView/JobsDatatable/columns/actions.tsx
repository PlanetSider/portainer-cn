import { FileText } from 'lucide-react';

import { Link } from '@@/Link';
import { Icon } from '@@/Icon';

import { columnHelper } from './helper';

export const actions = columnHelper.accessor(() => '', {
  header: '操作',
  id: 'actions',
  enableSorting: false,
  cell: ({ row: { original: job } }) => (
    <Cell
      name={job.Name}
      namespace={job.Namespace}
      podName={job.PodName}
      containerName={job.Container?.name}
    />
  ),
});

type CellProps = {
  name: string;
  namespace: string;
  podName: string;
  containerName?: string;
};

function Cell({ name, namespace, podName, containerName }: CellProps) {
  return (
    <Link
      className="flex items-center gap-1"
      to="kubernetes.applications.application.logs"
      params={{
        name: podName,
        namespace,
        pod: podName,
        container: containerName,
      }}
      data-cy={`job-logs-${namespace}-${name}-${containerName}`}
    >
      <Icon icon={FileText} />
      日志
    </Link>
  );
}
