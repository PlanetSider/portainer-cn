import { useCurrentStateAndParams } from '@uirouter/react';

import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';

import { NamespaceDetailsWidget } from './NamespaceDetailsWidget';
import { AccessDatatable } from './AccessDatatable/AccessDatatable';
import { CreateAccessWidget } from './CreateAccessWidget/CreateAccessWidget';

export function AccessView() {
  const {
    params: { id: namespaceName },
  } = useCurrentStateAndParams();
  useUnauthorizedRedirect(
    { authorizations: ['K8sResourcePoolDetailsW'] },
    { to: 'kubernetes.resourcePools' }
  );
  return (
    <>
      <PageHeader
        title="命名空间访问管理"
        breadcrumbs={[
          { label: '命名空间', link: 'kubernetes.resourcePools' },
          {
            label: namespaceName,
            link: 'kubernetes.resourcePools.resourcePool',
            linkParams: { id: namespaceName },
          },
          '访问管理',
        ]}
        reload
      />
      <NamespaceDetailsWidget />
      <CreateAccessWidget />
      <AccessDatatable />
    </>
  );
}
