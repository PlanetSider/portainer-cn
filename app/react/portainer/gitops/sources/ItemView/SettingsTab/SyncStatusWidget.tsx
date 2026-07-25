import { ShieldAlertIcon } from 'lucide-react';
import moment from 'moment';

import { Card } from '@@/primitives/Card';
import { StatusDot } from '@@/primitives/StatusDot';
import { Badge } from '@@/Badge';
import { Alert } from '@@/Alert';

import { SourceDetail } from '../../queries/useSource';

import { DetailField } from './DetailField';

interface Props {
  source: SourceDetail;
}

export function SyncStatusWidget({ source }: Props) {
  const lastSyncLabel = source.lastSync
    ? moment.unix(source.lastSync).fromNow()
    : '-';

  const dotColor = getStatusColor(source.status);

  const statusLabel = source.status
    ? {
        healthy: '正常',
        error: '错误',
        syncing: '同步中',
        paused: '已暂停',
        unknown: '未知',
      }[source.status]
    : '-';

  return (
    <Card.Container>
      <Card.Header
        icon={ShieldAlertIcon}
        title="同步状态"
        subtitle="上次同步的运行状况和时间"
      />
      <Card.Body className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="状态">
            {source.status ? (
              <Badge type={dotColor} shape="pill" data-cy="source-status">
                <StatusDot color={dotColor} size="xs" /> {statusLabel}
              </Badge>
            ) : (
              '-'
            )}
          </DetailField>
          <DetailField label="上次同步">
            <span data-cy="source-last-sync">{lastSyncLabel}</span>
          </DetailField>
        </div>
        {source.error && <Alert color="error">{source.error}</Alert>}
      </Card.Body>
    </Card.Container>
  );
}

function getStatusColor(
  status?: SourceDetail['status']
): 'success' | 'warn' | 'danger' | 'info' | 'muted' {
  switch (status) {
    case 'healthy':
      return 'success';
    case 'error':
      return 'danger';
    case 'syncing':
      return 'warn';
    case 'paused':
      return 'muted';
    case 'unknown':
    case undefined:
    default:
      return 'muted';
  }
}
