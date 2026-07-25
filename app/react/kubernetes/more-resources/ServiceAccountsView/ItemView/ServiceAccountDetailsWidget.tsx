import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { SystemBadge } from '@@/Badge/SystemBadge';
import { DetailsRow } from '@@/DetailsTable/DetailsRow';
import { DetailsTable } from '@@/DetailsTable/DetailsTable';
import { Link } from '@@/Link';
import { Tooltip } from '@@/Tip/Tooltip';
import { Widget, WidgetBody } from '@@/Widget';

import { useServiceAccount } from '../queries/useServiceAccount';

import { ImagePullSecretsRow } from './ImagePullSecretsRow';

type Props = { namespace: string; name: string };

export function ServiceAccountDetailsWidget({ namespace, name }: Props) {
  const environmentId = useEnvironmentId();
  const serviceAccountQuery = useServiceAccount(environmentId, namespace, name);
  const { data: serviceAccount } = serviceAccountQuery;
  const { isLoading } = serviceAccountQuery;

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody loading={isLoading}>
            <DetailsTable
              dataCy="k8sSADetail-table"
              className="[&_td:first-child]:w-2/5"
            >
              <DetailsRow label="名称">
                {serviceAccount?.name}
                {serviceAccount?.isSystem && <SystemBadge className="ml-1" />}
              </DetailsRow>
              <DetailsRow label="命名空间">
                <Link
                  to="kubernetes.resourcePools.resourcePool"
                  params={{ id: namespace }}
                  data-cy="namespace-link"
                >
                  {namespace}
                </Link>
                {serviceAccount?.isSystem && <SystemBadge className="ml-1" />}
              </DetailsRow>
              <DetailsRow label="创建时间">
                {serviceAccount?.creationDate
                  ? new Date(serviceAccount.creationDate).toLocaleString()
                  : '-'}
              </DetailsRow>
              <DetailsRow
                label={
                  <>
                    自动挂载令牌
                    <Tooltip message="控制 Pod 是否自动获取用于访问集群的 API 令牌。对于不需要访问 Kubernetes API 的工作负载，禁用此项可降低攻击面；单个 Pod 仍可覆盖此设置。" />
                  </>
                }
              >
                <span className="flex items-center">
                  {serviceAccount?.automountServiceAccountToken === false
                    ? '已禁用'
                    : '已启用'}
                </span>
              </DetailsRow>

              <ImagePullSecretsRow
                namespace={namespace}
                name={name}
                imagePullSecrets={serviceAccount?.imagePullSecrets ?? []}
                isSystem={serviceAccount?.isSystem}
              />
            </DetailsTable>
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
