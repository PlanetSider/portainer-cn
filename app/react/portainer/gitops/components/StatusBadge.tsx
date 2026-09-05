import { Badge } from '@@/Badge';
import { StatusDot } from '@@/primitives/StatusDot';

import {
  WorkflowStatus,
  WorkflowType,
  DeploymentPlatform,
} from '../workflows/types';

const BADGE_TYPE = {
  healthy: 'success',
  error: 'danger',
  syncing: 'warn',
  paused: 'muted',
  unknown: 'muted',
} as const;

const STATUS_LABELS: Record<WorkflowStatus, string> = {
  healthy: '正常',
  error: '错误',
  syncing: '同步中',
  paused: '已暂停',
  unknown: '未知',
};

export function StatusBadge({ status }: { status: WorkflowStatus }) {
  return (
    <Badge type={BADGE_TYPE[status]} shape="pill" size="md">
      <StatusDot color={BADGE_TYPE[status]} size="xs" /> {STATUS_LABELS[status]}
    </Badge>
  );
}

const TYPE_LABELS: Record<WorkflowType, string> = {
  stack: '堆栈',
  edgeStack: 'Edge 堆栈',
};
export function TypeBadge({ type }: { type: WorkflowType }) {
  return <Badge type="muted">{TYPE_LABELS[type]}</Badge>;
}

const PLATFORM_LABELS: Record<DeploymentPlatform, string> = {
  dockerStandalone: 'Docker 独立环境',
  dockerSwarm: 'Docker Swarm',
  kubernetes: 'Kubernetes',
};
export function PlatformBadge({
  platform,
}: {
  platform: DeploymentPlatform | undefined;
}) {
  return (
    <Badge type="muted">
      {platform ? PLATFORM_LABELS[platform] : '未知'}
    </Badge>
  );
}
