import { Row } from '@tanstack/react-table';

import { Event } from '@/react/kubernetes/queries/types';

import { filterHOC } from '@@/datatables/Filter';

import { columnHelper } from './helper';

export const kind = columnHelper.accessor(
  (event) => event.involvedObject.kind,
  {
    header: '类型',
    meta: {
      filter: filterHOC('按类型筛选'),
    },
    enableColumnFilter: true,
    filterFn: (row: Row<Event>, _: string, filterValue: string[]) =>
      filterValue.length === 0 ||
      (!!row.original.involvedObject.kind &&
        filterValue.includes(row.original.involvedObject.kind)),
  }
);
