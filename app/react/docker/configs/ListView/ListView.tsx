import { PageHeader } from '@@/PageHeader';

import { ConfigsDatatable } from './ConfigsDatatable/ConfigsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="Config 列表" breadcrumbs="Config" reload />

      <ConfigsDatatable />
    </>
  );
}
