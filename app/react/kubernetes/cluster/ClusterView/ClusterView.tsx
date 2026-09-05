import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { PageHeader } from '@/react/components/PageHeader';
import { NodesDatatable } from '@/react/kubernetes/cluster/HomeView/NodesDatatable';

import { ClusterResourceReservation } from './ClusterResourceReservation';

export function ClusterView() {
  const { data: environment } = useCurrentEnvironment();

  return (
    <>
      <PageHeader
        title="集群"
        breadcrumbs={[
          { label: '环境', link: 'portainer.endpoints' },
          {
            label: environment?.Name || '',
            link: 'portainer.endpoints.endpoint',
            linkParams: { id: environment?.Id },
          },
          '集群信息',
        ]}
        reload
      />

      <ClusterResourceReservation />

      <div className="row">
        <NodesDatatable />
      </div>
    </>
  );
}
