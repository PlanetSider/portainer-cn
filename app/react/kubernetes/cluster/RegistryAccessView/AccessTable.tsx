import { UserX } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';

import { Datatable } from '@@/datatables';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';
import { DeleteButton } from '@@/buttons/DeleteButton';

type Item = { value: string };

const columnHelper = createColumnHelper<Item>();

const columns = [
  columnHelper.accessor('value', {
    header: '命名空间',
  }),
];

const tableKey = 'kube-access-table';

const store = createPersistedStore(tableKey);

export function AccessTable({
  dataset,
  onRemove,
}: {
  dataset: Array<Item>;
  onRemove: (selectedItems: Array<Item>) => void;
}) {
  const tableState = useTableState(store, tableKey);

  return (
    <Datatable
      title="访问控制"
      titleIcon={UserX}
      dataset={dataset}
      columns={columns}
      settingsManager={tableState}
      getRowId={(row) => row.value}
      renderTableActions={(selectedItems) => (
        <DeleteButton
          disabled={selectedItems.length === 0}
          confirmMessage={
            <>
              <p>
                该镜像仓库可能正被此环境中的一个或多个应用使用。移除仓库访问权限可能会导致这些应用发生服务中断。
              </p>
              <p>确定要继续吗？</p>
            </>
          }
          onConfirmed={() => onRemove(selectedItems)}
          data-cy="remove-registry-access-button"
        />
      )}
      data-cy="registry-access-datatable"
    />
  );
}
