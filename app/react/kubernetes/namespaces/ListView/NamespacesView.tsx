import { PageHeader } from '@@/PageHeader';

import { NamespacesDatatable } from './NamespacesDatatable';

export function NamespacesView() {
  return (
    <>
      <PageHeader title="命名空间列表" breadcrumbs="命名空间" reload />
      <NamespacesDatatable />
    </>
  );
}
