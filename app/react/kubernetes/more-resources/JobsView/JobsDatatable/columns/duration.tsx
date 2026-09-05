import { columnHelper } from './helper';

export const duration = columnHelper.accessor((row) => row.Duration, {
  header: '持续时间',
  id: 'duration',
  cell: ({ getValue }) => getValue() ?? '',
});
