import { createColumnHelper } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { slugify } from 'markdown-to-jsx';

import { formatDate } from '@/portainer/filters/filters';

import { Badge } from '@@/Badge';
import { Link } from '@@/Link';
import { Button } from '@@/buttons';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Icon } from '@@/Icon';

import { StorageClass } from './types';

const helper = createColumnHelper<StorageClass>();

export function createStorageClassesColumns(
  onSetDefault: (storageClass: StorageClass) => void
) {
  return [
    helper.accessor('name', {
      header: '名称',
      cell: ({ row, getValue }) => {
        const name = getValue();
        return (
          <div className="flex items-center gap-2">
            <Link
              to="kubernetes.volumes.storageClass"
              params={{ name }}
              data-cy={`storage-class-name-link-${name}`}
            >
              {name}
            </Link>
            {row.original.isDefault && <Badge type="success">默认</Badge>}
          </div>
        );
      },
    }),
    helper.accessor('provisioner', {
      header: '制备器',
    }),
    helper.accessor('reclaimPolicy', {
      header: '回收策略',
      cell: ({ getValue }) => getValue() ?? '-',
    }),
    helper.accessor('allowVolumeExpansion', {
      header: '卷扩容',
      cell: ({ getValue }) => (getValue() ? '允许' : '不允许'),
    }),
    helper.accessor((row) => formatDate(row.creationDate), {
      header: '创建时间',
      id: 'created',
    }),
    helper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row: { original } }) => (
        <TooltipWithChildren
          message={
            original.isDefault ? '已是默认存储类' : '设为默认存储类'
          }
          position="top"
        >
          <Button
            color="light"
            className="!ml-0"
            disabled={original.isDefault}
            data-cy={`k8s-storage-class-set-default-${slugify(original.name)}`}
            onClick={() => onSetDefault(original)}
          >
            <Icon icon={Star} />
          </Button>
        </TooltipWithChildren>
      ),
    }),
  ];
}
