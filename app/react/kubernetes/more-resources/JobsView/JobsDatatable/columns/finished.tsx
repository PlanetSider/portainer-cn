import { columnHelper } from './helper';

export const finished = columnHelper.accessor((row) => row.FinishTime, {
  header: '完成时间',
  id: 'finished',
  cell: ({ getValue }) => getValue() ?? '',
});
