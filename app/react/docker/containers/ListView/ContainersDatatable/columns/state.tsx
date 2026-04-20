import clsx from 'clsx';
import { CellContext } from '@tanstack/react-table';

import {
  type ContainerListViewModel,
  ContainerStatus,
} from '@/react/docker/containers/types';

import { filterHOC } from '@@/datatables/Filter';
import { multiple } from '@@/datatables/filter-types';

import { columnHelper } from './helper';

export const state = columnHelper.accessor('Status', {
  header: '状态',
  id: 'state',
  cell: StatusCell,
  enableColumnFilter: true,
  filterFn: multiple,
  meta: {
    filter: filterHOC('按状态筛选'),
  },
});

function StatusCell({
  getValue,
  row: { original: container },
}: CellContext<ContainerListViewModel, ContainerStatus>) {
  const status = getValue();

  const hasHealthCheck = [
    ContainerStatus.Starting,
    ContainerStatus.Healthy,
    ContainerStatus.Unhealthy,
  ].includes(status);

  const statusClassName = getClassName();

  let transformedStatus: ContainerStatus | string = status;
  if (transformedStatus === ContainerStatus.Exited) {
    transformedStatus = `已退出 - 代码 ${extractExitCode(container.StatusText)}`;
  } else {
    transformedStatus =
      {
        paused: '已暂停',
        starting: '启动中',
        unhealthy: '不健康',
        restarting: '重启中',
        removing: '移除中',
        created: '已创建',
        stopped: '已停止',
        dead: '已终止',
        healthy: '健康',
        running: '运行中',
      }[transformedStatus] || transformedStatus;
  }

  return (
    <span
      className={clsx('label', `label-${statusClassName}`, {
        interactive: hasHealthCheck,
      })}
      title={hasHealthCheck ? '此容器已启用健康检查' : ''}
    >
      {transformedStatus}
    </span>
  );

  function getClassName() {
    switch (status) {
      case ContainerStatus.Paused:
      case ContainerStatus.Starting:
      case ContainerStatus.Unhealthy:
      case ContainerStatus.Restarting:
      case ContainerStatus.Removing:
        return 'warning';
      case ContainerStatus.Created:
        return 'info';
      case ContainerStatus.Stopped:
      case ContainerStatus.Dead:
      case ContainerStatus.Exited:
        return 'danger';
      case ContainerStatus.Healthy:
      case ContainerStatus.Running:
      default:
        return 'success';
    }
  }

  function extractExitCode(statusText: string) {
    const regex = /\((\d+)\)/;
    const match = statusText.match(regex);
    return match ? match[1] : '';
  }
}
