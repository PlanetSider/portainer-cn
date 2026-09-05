import { columnHelper } from './helper';

export const timezone = columnHelper.accessor((row) => row.Timezone, {
  header: '时区',
  id: 'timezone',
  cell: ({ getValue }) => getValue() ?? '',
});
