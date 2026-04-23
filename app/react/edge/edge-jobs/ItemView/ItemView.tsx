import { ListIcon, WrenchIcon } from 'lucide-react';

import { useIdParam } from '@/react/hooks/useIdParam';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';
import { Tab, useCurrentTabIndex, WidgetTabs } from '@@/Widget/WidgetTabs';

import { useEdgeJob } from '../queries/useEdgeJob';

import { UpdateEdgeJobForm } from './UpdateEdgeJobForm/UpdateEdgeJobForm';
import { ResultsDatatable } from './ResultsDatatable/ResultsDatatable';

const TABS_FOR_INDEX: Tab[] = [
  {
    name: '配置',
    icon: WrenchIcon,
    widget: null,
    selectedTabParam: 'configuration',
  },
  {
    name: '结果',
    icon: ListIcon,
    widget: null,
    selectedTabParam: 'results',
  },
];

export function ItemView() {
  const id = useIdParam();
  const edgeJobQuery = useEdgeJob(id);
  const currentTabIndex = useCurrentTabIndex(TABS_FOR_INDEX);

  if (!edgeJobQuery.data) {
    return null;
  }

  const edgeJob = edgeJobQuery.data;

  const tabs: Tab[] = [
    {
      name: '配置',
      icon: WrenchIcon,
      widget: (
        <div className="row">
          <div className="col-sm-12">
            <Widget>
              <Widget.Body>
                <UpdateEdgeJobForm edgeJob={edgeJob} />
              </Widget.Body>
            </Widget>
          </div>
        </div>
      ),
      selectedTabParam: 'configuration',
    },
    {
      name: '结果',
      icon: ListIcon,
      widget: <ResultsDatatable jobId={edgeJob.Id} />,
      selectedTabParam: 'results',
    },
  ];

  return (
    <>
      <PageHeader
        title="边缘任务详情"
        breadcrumbs={[{ label: '边缘任务', link: 'edge.jobs' }, edgeJob.Name]}
      />

      {tabs.length === 1 ? (
        <div className="row">
          <div className="col-sm-12">{tabs[0].widget}</div>
        </div>
      ) : (
        <>
          <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
          {tabs[currentTabIndex].widget}
        </>
      )}
    </>
  );
}
