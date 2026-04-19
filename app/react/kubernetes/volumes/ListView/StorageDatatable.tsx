import { createColumnHelper } from '@tanstack/react-table';
import { HardDrive } from 'lucide-react';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { humanize } from '@/portainer/filters/filters';

import { TableSettingsMenu } from '@@/datatables';
import {
  BasicTableSettings,
  RefreshableTableSettings,
  refreshableSettings,
} from '@@/datatables/types';
import { useTableStateWithStorage } from '@@/datatables/useTableState';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';
import { ExpandableDatatable } from '@@/datatables/ExpandableDatatable';
import { buildExpandColumn } from '@@/datatables/expand-column';
import { Link } from '@@/Link';

import { useAllStoragesQuery } from '../queries/useVolumesQuery';

import { StorageClassViewModel } from './types';

interface TableSettings extends BasicTableSettings, RefreshableTableSettings {}

const helper = createColumnHelper<StorageClassViewModel>();

const columns = [
  buildExpandColumn<StorageClassViewModel>(),
  helper.accessor('Name', {
    header: '存储类',
  }),
  helper.accessor('size', {
    header: '使用量',
    cell: ({ row: { original: item } }) => <>{humanize(item.size)}</>,
  }),
];

export function StorageDatatable() {
  const tableState = useTableStateWithStorage<TableSettings>(
    'kubernetes.volumes.storages',
    'Name',
    (set) => ({
      ...refreshableSettings(set),
    })
  );

  const envId = useEnvironmentId();
  const storagesQuery = useAllStoragesQuery(envId, {
    refetchInterval: tableState.autoRefreshRate * 1000,
  });
  const storages = storagesQuery.data ?? [];

  return (
    <ExpandableDatatable
      disableSelect
      dataset={storages}
      columns={columns}
      title="存储"
      titleIcon={HardDrive}
      settingsManager={tableState}
      isLoading={storagesQuery.isLoading}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={tableState.autoRefreshRate}
            onChange={(value) => tableState.setAutoRefreshRate(value)}
          />
        </TableSettingsMenu>
      )}
      getRowId={(row) => row.Name}
      getRowCanExpand={(row) => row.original.Volumes.length > 0}
      renderSubRow={(row) => <SubRow item={row.original} />}
      data-cy="k8s-storage-datatable"
    />
  );
}

function SubRow({ item }: { item: StorageClassViewModel }) {
  return (
    <>
      {item.Volumes.map((vol) => (
        <tr key={vol.PersistentVolumeClaim.Id}>
          <td />
          <td>
            <Link
              to="kubernetes.volumes.volume"
              params={{
                name: vol.PersistentVolumeClaim.Name,
                namespace: vol.PersistentVolumeClaim.Namespace,
              }}
              data-cy={`volume-link-${vol.PersistentVolumeClaim.Name}`}
            >
              {vol.PersistentVolumeClaim.Name}
            </Link>
          </td>
          <td>{humanize(vol.PersistentVolumeClaim.Storage)}</td>
        </tr>
      ))}
    </>
  );
}
