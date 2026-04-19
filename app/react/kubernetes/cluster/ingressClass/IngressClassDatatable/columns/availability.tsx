import { CellContext } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';

import { Badge } from '@@/Badge';
import { Icon } from '@@/Icon';

import type { IngressControllerClassMap } from '../../types';

import { columnHelper } from './helper';

export const availability = columnHelper.accessor('Availability', {
  header: '可用性',
  cell: Cell,
  id: 'availability',
  invertSorting: true,
  sortingFn: 'basic',
});

function Cell({ getValue }: CellContext<IngressControllerClassMap, boolean>) {
  const availability = getValue();

  return (
    <Badge type={availability ? 'success' : 'danger'}>
      <Icon icon={availability ? Check : X} className="!mr-1" />
      {availability ? '允许' : '禁用'}
    </Badge>
  );
}
