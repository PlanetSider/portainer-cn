import { createColumnHelper } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { slugify } from 'markdown-to-jsx';

import { formatDate } from '@/portainer/filters/filters';

import { StatusBadge, StatusBadgeType } from '@@/StatusBadge';
import { Link } from '@@/Link';
import { Button } from '@@/buttons';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Icon } from '@@/Icon';

import { PersistentVolume, PersistentVolumeStatus } from './types';

const helper = createColumnHelper<PersistentVolume>();

export function createPersistentVolumesColumns(
  onEditReclaimPolicy: (volume: PersistentVolume) => void
) {
  return [
    helper.accessor('name', {
      header: '名称',
      cell: ({ getValue }) => {
        const name = getValue();
        return (
          <Link
            to="kubernetes.volumes.persistentVolume"
            params={{ name }}
            data-cy={`persistent-volume-name-link-${name}`}
          >
            {name}
          </Link>
        );
      },
    }),
    helper.accessor('status', {
      header: '状态',
      cell: ({ getValue }) => {
        const status = getValue();
        return <StatusBadge color={statusColor(status)}>{status}</StatusBadge>;
      },
    }),
    helper.accessor((row) => row.capacity?.storage, {
      header: '容量',
      id: 'capacity',
    }),
    helper.accessor((row) => row.humanReadableAccessModes.join(', '), {
      header: '访问模式',
      id: 'accessModes',
    }),
    helper.accessor('persistentVolumeReclaimPolicy', {
      header: '回收策略',
    }),
    helper.accessor('storageClassName', {
      header: '存储类',
    }),
    helper.accessor('claimRef', {
      header: '声明',
      id: 'claim',
      cell: ({ row: { original } }) =>
        original.claimRef ? (
          <Link
            to="kubernetes.volumes.volume"
            params={{
              namespace: original.claimRef.namespace,
              name: original.claimRef.name,
            }}
            data-cy={`volume-link-${original.claimRef.name}`}
          >
            {original.claimRef.namespace}/{original.claimRef.name}
          </Link>
        ) : (
          ''
        ),
    }),
    helper.accessor((row) => formatDate(row.creationDate), {
      header: '创建时间',
      id: 'created',
    }),
    helper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row: { original } }) => {
        return (
          <TooltipWithChildren message="编辑回收策略" position="top">
            <Button
              color="light"
              className="!ml-0"
              data-cy={`kubernetes-pv-reclaim-edit-${slugify(original.name)}`}
              onClick={() => onEditReclaimPolicy(original)}
            >
              <Icon icon={Edit} />
            </Button>
          </TooltipWithChildren>
        );
      },
    }),
  ];
}

function statusColor(status: PersistentVolumeStatus): StatusBadgeType {
  switch (status) {
    case 'Bound':
    case 'Available':
      return 'successLite';
    case 'Released':
      return 'warningLite';
    case 'Failed':
      return 'dangerLite';
    default:
      return 'mutedLite';
  }
}
