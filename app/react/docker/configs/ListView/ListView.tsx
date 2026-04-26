import { PageHeader } from '@@/PageHeader';

import { ConfigsDatatable } from './ConfigsDatatable/ConfigsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="配置（Config）列表" breadcrumbs="配置（Config）" reload />

      <ConfigsDatatable />
    </>
  );
}
