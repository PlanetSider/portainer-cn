import { formatDate } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const started = columnHelper.accessor(
  (row) => formatDate(row.StartTime),
  {
    header: '开始时间',
    id: 'started',
    cell: ({ getValue }) => getValue() ?? '',
  }
);
