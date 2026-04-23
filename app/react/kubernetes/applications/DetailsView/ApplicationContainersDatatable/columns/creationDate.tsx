import { formatDate } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const creationDate = columnHelper.accessor(
  (row) => formatDate(row.creationDate),
  {
    header: '创建时间',
    cell: ({ getValue }) => getValue(),
  }
);
