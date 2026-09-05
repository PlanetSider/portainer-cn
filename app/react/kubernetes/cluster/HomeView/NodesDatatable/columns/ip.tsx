import { getInternalNodeIpAddress } from '../../../nodeUtils';

import { columnHelper } from './helper';

export const ip = columnHelper.accessor(
  (row) => getInternalNodeIpAddress(row) ?? '-',
  {
    header: 'IP 地址',
    cell: ({ row }) => getInternalNodeIpAddress(row.original) ?? '-',
  }
);
