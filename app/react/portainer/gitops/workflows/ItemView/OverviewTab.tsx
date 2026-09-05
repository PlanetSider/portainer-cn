import { PackageOpenIcon } from 'lucide-react';

import { Card } from '@@/primitives/Card';
import { Icon } from '@@/Icon';

import { useWorkflowSources } from '../queries/useWorkflowSources';
import { Workflow } from '../types';

import { StacksSection } from './StacksSection';
import { TargetsSection } from './TargetsSection';
import { FilesSection } from './FilesSection';
import { SourcesSection } from './SourcesSection';

interface Props {
  workflow: Workflow;
}

export function OverviewTab({ workflow }: Props) {
  const sources = useWorkflowSources(workflow.artifacts);

  if (workflow.artifacts.length === 0) {
    return <EmptyOverview />;
  }

  return (
    <div className="space-y-4">
      <SourcesSection sources={sources} />
      <FilesSection artifacts={workflow.artifacts} sources={sources} />
      <TargetsSection artifacts={workflow.artifacts} />
      <StacksSection artifacts={workflow.artifacts} />
    </div>
  );
}

function EmptyOverview() {
  return (
    <Card.Container>
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Icon icon={PackageOpenIcon} size="xl" className="text-gray-5" />
        <p className="m-0 font-semibold text-gray-9 th-highcontrast:text-white th-dark:text-white">
          无工件
        </p>
        <p className="m-0 text-sm text-gray-6">
          此工作流尚未关联任何堆栈或 Edge 堆栈。
        </p>
      </div>
    </Card.Container>
  );
}
