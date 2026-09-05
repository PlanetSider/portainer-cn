import { columnHelper } from './helper';

export const type = columnHelper.accessor('Type', {
  header: 'Ingress 控制器类型',
  cell: ({ getValue }) => {
    const type = getValue();
    return type || '-';
  },
  id: 'type',
});
