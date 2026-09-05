import { RefreshCwIcon } from 'lucide-react';

import { Card } from '@@/primitives/Card';

import { DetailField } from './DetailField';

interface Props {
  interval?: string;
}

export function PollingWidget({ interval }: Props) {
  return (
    <Card.Container>
      <Card.Header
        icon={RefreshCwIcon}
        title="轮询"
        subtitle="定期拉取此仓库以检测变更"
      />
      <Card.Body>
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="状态">
            <span className="text-gray-6 th-dark:text-gray-5">
              {interval ? '已启用' : '已禁用'}
            </span>
          </DetailField>
          {interval && (
            <DetailField label="间隔">
              <span className="text-gray-6 th-dark:text-gray-5">
                {interval}
              </span>
            </DetailField>
          )}
        </div>
      </Card.Body>
    </Card.Container>
  );
}
