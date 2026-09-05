import { NodeCondition } from 'kubernetes-types/core/v1';
import { CellContext } from '@tanstack/react-table';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';

import { NodeRowData } from '../types';

import { columnHelper } from './helper';

export const conditions = columnHelper.accessor((row) => getConditions(row), {
  header: () => (
    <>
      条件
      <Tooltip
        position="top"
        message="空白表示节点运行正常。橙色表示节点出现内存压力、磁盘压力、网络不可用或进程 ID 压力。"
      />
    </>
  ),
  id: 'conditions',
  cell: ConditionsCell,
});

function ConditionsCell({
  row: { original: node },
}: CellContext<NodeRowData, NodeCondition[]>) {
  const conditions = getConditions(node);

  return (
    <div className="flex flex-wrap gap-1">
      {conditions.length > 0
        ? conditions.map((condition) => (
            <Badge
              key={condition.type?.toString()}
              type={condition.status === 'True' ? 'warn' : 'success'}
            >
              {getConditionLabel(condition.type)}
            </Badge>
          ))
        : '-'}
    </div>
  );
}

function getConditionLabel(type?: string) {
  return {
    MemoryPressure: '内存压力',
    DiskPressure: '磁盘压力',
    NetworkUnavailable: '网络不可用',
    PIDPressure: '进程 ID 压力',
  }[type ?? ''] ?? type;
}

function getConditions(node: NodeRowData) {
  return (
    // exclude the Ready condition and search for unhealthy conditions
    node.status?.conditions?.filter(
      (condition) => condition.type !== 'Ready' && condition.status === 'True'
    ) ?? []
  );
}
