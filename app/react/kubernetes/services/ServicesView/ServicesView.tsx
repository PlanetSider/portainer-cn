import { PageHeader } from '@@/PageHeader';

import { ServicesDatatable } from './ServicesDatatable';

export function ServicesView() {
  return (
    <>
      <PageHeader title="服务列表" breadcrumbs="服务" reload />
      <ServicesDatatable />
    </>
  );
}
