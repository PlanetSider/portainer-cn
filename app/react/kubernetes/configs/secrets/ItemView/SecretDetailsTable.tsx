import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useGetAllServiceAccountsQuery } from '@/react/kubernetes/more-resources/ServiceAccountsView/ServiceAccountsDatatable/queries/useGetAllServiceAccountsQuery';

import { Badge } from '@@/Badge';
import { SystemBadge } from '@@/Badge/SystemBadge';
import { DetailsRow } from '@@/DetailsTable/DetailsRow';
import { DetailsTable } from '@@/DetailsTable/DetailsTable';
import { Link } from '@@/Link';
import { Tooltip } from '@@/Tip/Tooltip';

import { RegistryBadge } from '../RegistryBadge';

type Props = {
  name: string;
  namespace: string;
  secretTypeLabel: string;
  // Passed from Angular as ctrl.isSystemNamespace() — true when the namespace is a system namespace
  isSystem: boolean;
  // Angular passes annotation values as strings; accept both and parse internally
  registryId?: number | string;
};

export function SecretDetailsTable({
  name,
  namespace,
  secretTypeLabel,
  isSystem,
  registryId,
}: Props) {
  const parsedRegistryId =
    registryId !== undefined && registryId !== ''
      ? parseInt(String(registryId), 10) || undefined
      : undefined;

  return (
    <DetailsTable
      dataCy="k8sConfigDetail-configTable"
      className="[&_td:first-child]:w-2/5"
    >
      <DetailsRow label="名称">
        {name} {isSystem && <SystemBadge />}
      </DetailsRow>
      <DetailsRow label="命名空间">
        <Link
          to="kubernetes.resourcePools.resourcePool"
          params={{ id: namespace }}
          data-cy={`namespace-link-${namespace}`}
        >
          {namespace}
        </Link>{' '}
        {isSystem && <SystemBadge />}
      </DetailsRow>
      {secretTypeLabel && (
        <DetailsRow label="Secret 类型">{secretTypeLabel}</DetailsRow>
      )}
      {parsedRegistryId && (
        <DetailsRow label="Registry">
          <RegistryBadge registryId={parsedRegistryId}>
            <Tooltip message="该镜像仓库 Secret 由 Portainer 创建，用于允许拉取镜像。已禁用对此 Secret 的手动编辑。" />
          </RegistryBadge>
        </DetailsRow>
      )}
      <LinkedServiceAccountsRow secretName={name} namespace={namespace} />
    </DetailsTable>
  );
}

const MAX_VISIBLE_SERVICE_ACCOUNTS = 5;

type LinkedServiceAccountsRowProps = {
  secretName: string;
  namespace: string;
};

function LinkedServiceAccountsRow({
  secretName,
  namespace,
}: LinkedServiceAccountsRowProps) {
  const environmentId = useEnvironmentId();
  const { data: allServiceAccounts = [] } =
    useGetAllServiceAccountsQuery(environmentId);

  const linked = allServiceAccounts.filter(
    (sa) =>
      sa.namespace === namespace &&
      sa.imagePullSecrets?.some((s) => s.name === secretName)
  );

  const visible = linked.slice(0, MAX_VISIBLE_SERVICE_ACCOUNTS);
  const hidden = linked.slice(MAX_VISIBLE_SERVICE_ACCOUNTS);

  return (
    <DetailsRow
      label={
        <span className="flex items-center">
          关联的服务账号
          <Tooltip message="将此 Secret 用作镜像拉取凭据的服务账号。" />
        </span>
      }
    >
      <div className="flex flex-wrap gap-2">
        {visible.length > 0 ? (
          <>
            {visible.map((sa) => (
              <Badge key={sa.uid} type="info" className="min-w-max">
                <Link
                  to="kubernetes.moreResources.serviceAccounts.serviceAccount"
                  params={{ namespace: sa.namespace, name: sa.name }}
                  data-cy={`linked-service-account-link-${sa.name}`}
                  className="!text-inherit"
                >
                  {sa.name}
                </Link>
              </Badge>
            ))}
            {hidden.length > 0 && (
              <Badge type="muted" className="min-w-max cursor-default">
                 另有 {hidden.length} 项
              </Badge>
            )}
          </>
        ) : (
          <span className="text-muted">
            无，可将{' '}
            <Link
              to="kubernetes.moreResources.serviceAccounts"
              data-cy="service-account-link"
            >
              服务账号
            </Link>{' '}
            通过在服务账号规范中的 <code>imagePullSecrets</code> 字段引用到此 Secret。
          </span>
        )}
      </div>
    </DetailsRow>
  );
}
