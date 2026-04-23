import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';
import { ExternalLink } from '@@/ExternalLink';

import { ContainerRowData } from '../types';

import { columnHelper } from './helper';

export const name = columnHelper.accessor('name', {
  header: '名称',
  id: 'name',
  cell: ({ row: { original: container } }) => (
    <div className="flex justify-between gap-2">
      <span>{container.name}</span>
      <ContainerTypeBadge container={container} />
    </div>
  ),
});

function ContainerTypeBadge({ container }: { container: ContainerRowData }) {
  if (container.isSidecar) {
    return (
      <Badge type="info">
        Sidecar
        <Tooltip
          message={
            <>
              <ExternalLink
                to="https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/"
                data-cy="sidecar-link"
              >
               Sidecar containers
              </ExternalLink>{' '}
               会与主应用持续并行运行，并在其他容器之前启动。
            </>
          }
        />
      </Badge>
    );
  }

  if (container.isInit) {
    return (
      <Badge type="info">
        Init
        <Tooltip
          message={
            <>
              <ExternalLink
                to="https://kubernetes.io/docs/concepts/workloads/pods/init-containers/"
                data-cy="init-link"
              >
               Init containers
              </ExternalLink>{' '}
               会在主应用容器启动前先运行并完成。
            </>
          }
        />
      </Badge>
    );
  }

  return null;
}
