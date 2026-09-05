import { LinkIcon } from 'lucide-react';

import { Icon } from '@@/Icon';
import { Card } from '@@/primitives/Card';

import { SOURCE_TYPES } from '../../types';
import { SourceDetail } from '../../queries/useSource';

import { DetailField } from './DetailField';

interface Props {
  source: SourceDetail;
}

export function ConnectionDetailsWidget({ source }: Props) {
  const typeConfig = source.type ? SOURCE_TYPES[source.type] : undefined;

  return (
    <Card.Container>
      <Card.Header
        icon={LinkIcon}
        title="连接详情"
        subtitle="来源名称、URL 和连接设置"
      />
      <Card.Body className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="名称">{source.name ?? '-'}</DetailField>
          <DetailField label="类型">
            {typeConfig ? (
              <span className="flex items-center gap-1.5">
                <Icon icon={typeConfig.icon} size="sm" />
                {typeConfig.label}
              </span>
            ) : (
              '-'
            )}
          </DetailField>
        </div>
        <DetailField label="仓库 URL">
          <code
            className="bg-transparent p-0 font-mono text-sm"
            data-cy="source-url"
          >
            {source.url ?? '-'}
          </code>
        </DetailField>
      </Card.Body>
    </Card.Container>
  );
}
