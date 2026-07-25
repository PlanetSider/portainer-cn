import { Database, HardDrive } from 'lucide-react';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { PersistentVolumesDatatable } from './PersistentVolumesDatatable';
import { StorageClassesDatatable } from './StorageClassesDatatable';
import { PersistentVolumeClaimsDatatable } from './PersistentVolumeClaimsDatatable';

export function VolumesView() {
  const tabs: Tab[] = [
    {
      name: '持久卷声明',
      icon: Database,
      widget: <PersistentVolumeClaimsDatatable />,
      selectedTabParam: 'volume-claims',
    },
    {
      name: '持久卷',
      icon: Database,
      widget: <PersistentVolumesDatatable />,
      selectedTabParam: 'volumes',
    },
    {
      name: '存储类',
      icon: HardDrive,
      widget: <StorageClassesDatatable />,
      selectedTabParam: 'storage',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader title="存储卷列表" breadcrumbs="存储卷" reload />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
