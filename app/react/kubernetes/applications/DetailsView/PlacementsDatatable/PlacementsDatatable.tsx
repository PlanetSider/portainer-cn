import { Minimize2 } from 'lucide-react';

import {
  BasicTableSettings,
  RefreshableTableSettings,
} from '@@/datatables/types';
import { ExpandableDatatable } from '@@/datatables/ExpandableDatatable';
import { TableSettingsMenu } from '@@/datatables';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';
import { TextTip } from '@@/Tip/TextTip';

import { NodePlacementRowData } from '../types';

import { SubRow } from './PlacementsDatatableSubRow';
import { columns } from './columns';

interface TableSettings extends BasicTableSettings, RefreshableTableSettings {}

type Props = {
  isLoading: boolean;
  dataset: NodePlacementRowData[];
  hasPlacementWarning: boolean;
  tableState: TableSettings & {
    setSearch: (value: string) => void;
    search: string;
  };
};

export function PlacementsDatatable({
  isLoading,
  dataset,
  hasPlacementWarning,
  tableState,
}: Props) {
  return (
    <ExpandableDatatable
      isLoading={isLoading}
      getRowCanExpand={(row) => !row.original.acceptsApplication}
      title="节点与调度约束/偏好"
      titleIcon={Minimize2}
      dataset={dataset}
      settingsManager={tableState}
      getRowId={(row) => row.name}
      columns={columns}
      disableSelect
      description={
        hasPlacementWarning ? (
          <TextTip>
            根据调度规则，应用 Pod 无法调度到任何节点。
          </TextTip>
        ) : (
          <TextTip color="blue">
            下表显示此应用是否可以部署到列出的节点上。
          </TextTip>
        )
      }
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={tableState.autoRefreshRateMS}
            onChange={tableState.setAutoRefreshRate}
          />
        </TableSettingsMenu>
      )}
      renderSubRow={(row) => (
        <SubRow node={row.original} cellCount={row.getVisibleCells().length} />
      )}
      data-cy="kubernetes-application-placements-datatable"
    />
  );
}
