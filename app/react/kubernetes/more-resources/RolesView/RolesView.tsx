import { UserCheck, Link } from 'lucide-react';

import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { RolesDatatable } from './RolesDatatable';
import { RoleBindingsDatatable } from './RoleBindingsDatatable';

export function RolesView() {
  useUnauthorizedRedirect(
    { authorizations: ['K8sRoleBindingsW', 'K8sRolesW'], adminOnlyCE: true },
    { to: 'kubernetes.dashboard' }
  );

  const tabs: Tab[] = [
    {
      name: '角色',
      icon: UserCheck,
      widget: <RolesDatatable />,
      selectedTabParam: 'roles',
    },
    {
      name: '角色绑定',
      icon: Link,
      widget: <RoleBindingsDatatable />,
      selectedTabParam: 'roleBindings',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader title="角色列表" breadcrumbs="角色" reload />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
