import { RefreshCwIcon } from 'lucide-react';

import { Card } from '@@/primitives/Card';

import { AutoUpdateInfo } from '../../queries/useSource';

import { DetailField } from './DetailField';

interface Props {
  autoUpdate?: AutoUpdateInfo;
}

export function AutoUpdateWidget({ autoUpdate }: Props) {
  const mechanism = autoUpdate?.mechanism ?? '-';
  const fetchInterval = autoUpdate?.fetchInterval ?? '-';

  return (
    <Card.Container>
      <Card.Header
        icon={RefreshCwIcon}
        title="变更检测"
        subtitle="Portainer 检测新提交的方式"
      />
      <Card.Body>
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="机制">
            <span className="text-gray-6 th-dark:text-gray-5">{mechanism}</span>
          </DetailField>
          <DetailField label="拉取间隔">
            <span className="text-gray-6 th-dark:text-gray-5">
              {fetchInterval}
            </span>
          </DetailField>
        </div>
      </Card.Body>
    </Card.Container>
  );
}
