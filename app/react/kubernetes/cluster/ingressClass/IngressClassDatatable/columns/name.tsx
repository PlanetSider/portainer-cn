import { CellContext } from '@tanstack/react-table';

import { Badge } from '@@/Badge';

import type { IngressControllerClassMap } from '../../types';

import { columnHelper } from './helper';

export const name = columnHelper.accessor('ClassName', {
  header: 'Ingress 类别',
  cell: NameCell,
  id: 'name',
});

function NameCell({
  row,
  getValue,
}: CellContext<IngressControllerClassMap, string>) {
  const className = getValue();

  return (
    <span className="flex flex-nowrap gap-2">
      {className}
      {row.original.New && <Badge className="ml-auto">新检测到</Badge>}
    </span>
  );
}
