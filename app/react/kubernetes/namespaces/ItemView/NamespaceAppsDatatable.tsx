import { Code } from 'lucide-react';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { Datatable, TableSettingsMenu } from '@@/datatables';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';
import { useTableStateWithStorage } from '@@/datatables/useTableState';
import {
  BasicTableSettings,
  refreshableSettings,
  RefreshableTableSettings,
} from '@@/datatables/types';

import { useApplications } from '../../applications/queries/useApplications';

import { useColumns } from './columns';

interface TableSettings extends BasicTableSettings, RefreshableTableSettings {}

export function NamespaceAppsDatatable({ namespace }: { namespace: string }) {
  const environmentId = useEnvironmentId();
  const tableState = useTableStateWithStorage<TableSettings>(
    'kube-namespace-apps',
    'Name',
    (set) => ({
      ...refreshableSettings(set),
    })
  );

  const applicationsQuery = useApplications(environmentId, {
    refetchInterval: tableState.autoRefreshRateMS,
    namespace,
  });
  const applications = applicationsQuery.data ?? [];

  const columns = useColumns();

  return (
    <Datatable
      dataset={applications}
      settingsManager={tableState}
      columns={columns}
      disableSelect
      title="此命名空间中运行的应用"
      titleIcon={Code}
      isLoading={applicationsQuery.isLoading}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={tableState.autoRefreshRateMS}
            onChange={tableState.setAutoRefreshRate}
          />
        </TableSettingsMenu>
      )}
      data-cy="namespace-apps-datatable"
    />
  );
}
