import { PageHeader } from '@@/PageHeader';

import { IngressDatatable } from './IngressDatatable';

export function IngressesDatatableView() {
  return (
    <>
      <PageHeader
        title="Ingress 列表"
        breadcrumbs={[
          {
            label: 'Ingresses',
          },
        ]}
        reload
      />
      <IngressDatatable />
    </>
  );
}
