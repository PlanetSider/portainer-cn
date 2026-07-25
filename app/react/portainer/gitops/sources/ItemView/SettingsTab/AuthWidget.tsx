import { LockIcon } from 'lucide-react';

import { Card } from '@@/primitives/Card';
import { Badge } from '@@/Badge';

import { SourceDetail } from '../../queries/useSource';

import { DetailField } from './DetailField';

interface Props {
  auth?: SourceDetail['connection']['authentication'];
}

export function AuthWidget({ auth }: Props) {
  return (
    <Card.Container>
      <Card.Header
        icon={LockIcon}
        title="认证"
        subtitle="用于连接此来源的凭据"
      />
      <Card.Body>
        <div className="grid grid-cols-2 gap-4">
          {auth ? (
            <>
              <DetailField label="认证方式">
                <Badge type="info" data-cy="source-auth-method">
                  基本认证
                </Badge>
              </DetailField>
              <DetailField label="用户名">
                <span
                  className="font-mono text-sm"
                  data-cy="source-auth-credentials"
                >
                  {auth.username}
                </span>
              </DetailField>
            </>
          ) : (
            <DetailField label="认证方式">
              <Badge type={'muted'} data-cy="source-auth-method">
                无
              </Badge>
            </DetailField>
          )}
        </div>
      </Card.Body>
    </Card.Container>
  );
}
