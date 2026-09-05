import { columnHelper } from './helper';

export const schedule = columnHelper.accessor((row) => row.Schedule, {
  header: '调度计划',
  id: 'schedule',
  cell: ({ getValue }) => getValue() ?? '',
});
