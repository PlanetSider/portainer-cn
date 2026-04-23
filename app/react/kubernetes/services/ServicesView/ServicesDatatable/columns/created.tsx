import { formatDate } from '@/portainer/filters/filters';

import { columnHelper } from './helper';

export const created = columnHelper.accessor(
  (row) => {
    const owner = row.Labels?.['io.portainer.kubernetes.application.owner'];
    const date = formatDate(row.CreationDate);
    return owner ? `${date}，由 ${owner} 创建` : date;
  },
  {
    header: '创建时间',
    id: 'created',
    cell: ({ row }) => {
      const date = formatDate(row.original.CreationDate);

      const owner =
        row.original.Labels?.['io.portainer.kubernetes.application.owner'];

      return owner ? `${date}，由 ${owner} 创建` : date;
    },
  }
);
