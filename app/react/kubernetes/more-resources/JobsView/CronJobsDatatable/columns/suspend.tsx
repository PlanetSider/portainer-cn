import { columnHelper } from './helper';

export const suspend = columnHelper.accessor((row) => row.Suspend, {
  header: '暂停',
  id: 'suspend',
  cell: ({ getValue }) => {
    const suspended = getValue();
    return suspended ? '是' : '否';
  },
});
