import { createColumnHelper } from '@tanstack/react-table';
import { slugify } from 'markdown-to-jsx';
import { Edit } from 'lucide-react';

import { formatDate } from '@/portainer/filters/filters';

import { StatusBadge, StatusBadgeType } from '@@/StatusBadge';
import { Link } from '@@/Link';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';

import { PersistentVolumeClaim, PersistentVolumeClaimPhase } from './types';

const helper = createColumnHelper<PersistentVolumeClaim>();

export function createPersistentVolumeClaimsColumns(
  onEditResizeClaim: (claim: PersistentVolumeClaim) => void
) {
  return [
    helper.accessor('name', {
      header: '名称',
      cell: ({ row: { original } }) => {
        return original.namespace && original.name ? (
          <Link
            to="kubernetes.volumes.volume"
            params={{
              namespace: original.namespace,
              name: original.name,
            }}
            data-cy={`volume-link-${original.name}`}
          >
            {original.name}
          </Link>
        ) : (
          <>{original.name}</>
        );
      },
    }),
    helper.accessor('namespace', {
      header: '命名空间',
    }),
    helper.accessor('owningApplications', {
      header: '使用者',
      id: 'owningApplications',
      cell: ({ getValue }) => {
        const apps = getValue();
        if (!apps?.length) {
          return '-';
        }
        return (
          <div className="flex flex-col gap-y-1">
            {apps.map((app) => (
              <Link
                key={app.Uid ?? app.Name}
                to="kubernetes.applications.application"
                params={{
                  name: app.Name,
                  namespace: app.ResourcePool,
                  'resource-type': app.ApplicationType,
                }}
                data-cy={`pvc-owning-app-${app.Name}`}
              >
                {app.Name}
              </Link>
            ))}
          </div>
        );
      },
    }),
    helper.accessor('phase', {
      header: '状态',
      cell: ({ getValue }) => {
        const phase = getValue();
        return <StatusBadge color={phaseColor(phase)}>{phase}</StatusBadge>;
      },
    }),
    helper.accessor('storageRequest', {
      header: '容量',
    }),
    helper.accessor((row) => row.humanReadableAccessModes.join(', '), {
      header: '访问模式',
      id: 'accessModes',
    }),
    helper.accessor('storageClass', {
      header: '存储类',
    }),
    helper.accessor('volumeName', {
      header: '持久卷',
    }),
    helper.accessor((row) => formatDate(row.creationDate), {
      header: '创建时间',
      id: 'created',
    }),
    helper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row: { original } }) => {
        const isExpandable = original.allowVolumeExpansion;
        return (
          <TooltipWithChildren
            message={
              isExpandable
                ? '调整持久卷声明容量'
                : '存储类不允许扩容'
            }
            position="top"
          >
            <Button
              color="light"
              className="!ml-0"
              disabled={!isExpandable}
              data-cy={`kubernetes-pv-resize-edit-${slugify(original.name)}`}
              onClick={() => onEditResizeClaim(original)}
            >
              <Icon icon={Edit} />
            </Button>
          </TooltipWithChildren>
        );
      },
    }),
  ];
}

function phaseColor(phase: PersistentVolumeClaimPhase): StatusBadgeType {
  switch (phase) {
    case 'Bound':
      return 'successLite';
    case 'Pending':
      return 'warningLite';
    case 'Lost':
      return 'dangerLite';
    default:
      return 'mutedLite';
  }
}
