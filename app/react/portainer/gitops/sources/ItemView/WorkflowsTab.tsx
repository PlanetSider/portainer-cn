import { ChevronRight, GitCommitIcon, LayoutGridIcon } from 'lucide-react';
import moment from 'moment';

import { Card } from '@@/primitives/Card';
import { Icon } from '@@/Icon';
import { Link } from '@@/Link';

import {
  effectiveWorkflowStatus,
  Workflow,
  WorkflowTarget,
  WorkflowType,
} from '../../WorkflowsView/types';
import { StatusBadge } from '../../WorkflowsView/WorkflowBadges';

interface Props {
  workflows: Workflow[];
}

export function WorkflowsTab({ workflows }: Props) {
  return (
    <Card.Container>
      <Card.Header
        icon={GitCommitIcon}
        title="工作流"
        subtitle={`${workflows.length} 个工作流正在使用此来源`}
      />

      {workflows.length === 0 ? (
        <Card.Body>
          <p className="text-muted text-sm">
            没有工作流使用此来源。
          </p>
        </Card.Body>
      ) : (
        <WorkflowsList workflows={workflows} />
      )}
    </Card.Container>
  );
}

function WorkflowsList({ workflows }: { workflows: Array<Workflow> }) {
  return (
    <div className="space-y-2">
      {workflows.map((wf) => (
        <WorkflowCard key={wf.id} item={wf} />
      ))}
    </div>
  );
}

function WorkflowCard({ item }: { item: Workflow }) {
  return (
    <Link
      className="group flex items-center gap-3 p-4 text-inherit hover:bg-cyan-4/10 hover:text-current hover:!no-underline"
      to="portainer.gitops.workflows.item"
      params={{ id: item.id }}
      data-cy="workflow-item"
    >
      <div className="me-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-4 text-blue-7">
        <Icon icon={GitCommitIcon} size="lg" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <h6 className="m-0 text-sm font-medium tracking-wider">
            {item.name}
          </h6>
          <StatusBadge status={effectiveWorkflowStatus(item).status} />
        </div>
        <div className="flex items-center gap-3">
          <code className="bg-transparent p-0">
            {item.gitConfig?.ConfigFilePath}
          </code>
          <span>
            上次同步：{' '}
            {item.lastSyncDate
              ? moment.unix(item.lastSyncDate).fromNow()
              : '从未'}
          </span>
        </div>
      </div>

      <TargetBlock target={item.target} type={item.type} />
      <span className="text-gray-4 group-hover:text-gray-6">
        <Icon icon={ChevronRight} size="lg" />
      </span>
    </Link>
  );
}

function TargetBlock({
  target,
  type,
}: {
  target: WorkflowTarget;
  type: WorkflowType;
}) {
  return type === 'edgeStack' ? <EdgeStackTargetBlock target={target} /> : null;
}

function EdgeStackTargetBlock({ target }: { target: WorkflowTarget }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-solid border-gray-4 bg-gray-2 px-3 py-2 th-highcontrast:border-gray-11 th-highcontrast:bg-transparent th-dark:border-gray-8 th-dark:bg-gray-iron-10">
      <Icon icon={LayoutGridIcon} />
      <span className="font-bold text-graphite-700 th-highcontrast:text-white th-dark:text-white">
        {target.edgeGroupIds?.length ?? 0}
      </span>
      <span className="th-dark:text-gray text-xs text-gray-6 th-highcontrast:text-white th-dark:text-gray-6">
        组
      </span>
    </div>
  );
}
