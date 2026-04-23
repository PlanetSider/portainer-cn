import { Secret } from 'kubernetes-types/core/v1';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useCurrentUser } from '@/react/hooks/useUser';
import { useSecrets } from '@/react/kubernetes/configs/queries/useSecrets';
import { useRegistry } from '@/react/portainer/registries/queries/useRegistry';

import { Badge } from '@@/Badge';
import { SystemBadge } from '@@/Badge/SystemBadge';
import { DetailsRow } from '@@/DetailsTable/DetailsRow';
import { DetailsTable } from '@@/DetailsTable/DetailsTable';
import { Link } from '@@/Link';
import { Tooltip } from '@@/Tip/Tooltip';
import { Widget, WidgetBody } from '@@/Widget';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

import { useServiceAccount } from '../queries/useServiceAccount';

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
              <DetailsRow label="命名空间 Namespace">
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
                    自动挂载令牌 Automount token
                    <Tooltip message="控制 Pod 是否会自动获取用于访问集群的 API 令牌。禁用后，可减少不需要 Kubernetes API 访问的工作负载暴露面。单个 Pod 仍可覆盖此设置。" />
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
              />
            </DetailsTable>
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}

const MAX_VISIBLE_SECRETS = 5;

type ImagePullSecretName = { name: string };

type ImagePullSecretsRowProps = {
  namespace: string;
  name: string;
  imagePullSecrets: ImagePullSecretName[];
};

function ImagePullSecretsRow({
  namespace,
  name,
  imagePullSecrets,
}: ImagePullSecretsRowProps) {
  const environmentId = useEnvironmentId();
  const { data: secrets = [] } = useSecrets(environmentId, namespace);

  const pullSecretNamesToSecrets = linkImagePullSecretsToSecrets(
    secrets,
    imagePullSecrets
  );

  const visibleSecrets = pullSecretNamesToSecrets.slice(0, MAX_VISIBLE_SECRETS);
  const hiddenSecrets = pullSecretNamesToSecrets.slice(MAX_VISIBLE_SECRETS);

  return (
    <DetailsRow
      label={
        <span className="flex items-center">
           镜像拉取密钥 Image pull secrets
          <Tooltip
            message={
              name === 'default' ? (
                <>
                  此 &apos;default&apos; Service Account 的 <code>imagePullSecrets</code> 会应用于本命名空间内所有未显式指定 Service Account 的 <strong>Pod</strong>。
                </>
              ) : (
                <>
                  使用此 Service Account 的 Pod 会继承这些 <code>imagePullSecrets</code>。
                </>
              )
            }
          />
        </span>
      }
    >
      <div className="mt-2 flex flex-col">
        {visibleSecrets.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {visibleSecrets.map((s) => (
              <ImagePullSecretBadge
                key={s.name}
                secretName={s.name}
                namespace={namespace}
                secret={s.secret}
              />
            ))}
            {hiddenSecrets.length > 0 && (
              <TooltipWithChildren
                message={hiddenSecrets.map((s) => s.name).join(', ')}
              >
                <span>
                  <Badge type="muted" className="min-w-max cursor-default">
                     另有 {hiddenSecrets.length} 项
                  </Badge>
                </span>
              </TooltipWithChildren>
            )}
          </div>
        ) : (
          <span className="text-muted">无</span>
        )}
      </div>
    </DetailsRow>
  );
}

function linkImagePullSecretsToSecrets(
  secrets: Secret[],
  secretNames: { name: string }[]
) {
  return secretNames.map(({ name }) => {
    const secret = secrets.find((s) => s.metadata?.name === name);
    return { name, secret };
  });
}

type ImagePullSecretBadgeProps = {
  secretName: string;
  namespace: string;
  secret: Secret | undefined;
};

function ImagePullSecretBadge({
  secretName,
  namespace,
  secret,
}: ImagePullSecretBadgeProps) {
  const { isPureAdmin } = useCurrentUser();
  const registryIdStr =
    secret?.metadata?.annotations?.['portainer.io/registry.id'];
  const registryId = registryIdStr
    ? parseInt(registryIdStr, 10) || undefined
    : undefined;
  const { data: registry, isLoading: isRegistryLoading } =
    useRegistry(registryId);

  const registryTooltip = registry && (
    <Tooltip
      position="right"
      message={
        <div className="flex flex-col gap-1">
          <span>
            <span className="font-medium">Registry: </span>
            {isPureAdmin ? (
              <Link
                to="portainer.registries.registry"
                params={{ id: registry.Id }}
                className="!text-inherit underline"
                data-cy={`registry-link-${registry.Id}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {registry.Name}
              </Link>
            ) : (
              registry.Name
            )}
          </span>
          <span>
            <span className="font-medium">URL: </span>
            {registry.URL}
          </span>
        </div>
      }
    />
  );

  const registryNotFoundMessage =
    '找不到与此密钥关联的镜像仓库，它可能已被删除。';
  const showRegistryNotFound = !!registryId && !isRegistryLoading && !registry;

  const secretLink = (
    <Link
      to="kubernetes.secrets.secret"
      params={{ name: secretName, namespace }}
      data-cy={`image-pull-secret-link-${secretName}`}
      className="!text-inherit"
    >
      {secretName}
    </Link>
  );

  const missingSecretContent = (
    <>
      {secretName}
      <Tooltip message="该 Secret 在此命名空间中不存在。" />
    </>
  );

  function renderSecretName() {
    const content = secret ? secretLink : missingSecretContent;
    if (showRegistryNotFound) {
      return (
        <TooltipWithChildren message={registryNotFoundMessage}>
          <span>{content}</span>
        </TooltipWithChildren>
      );
    }
    return content;
  }

  return (
    <Badge
      type={secret ? 'info' : 'warn'}
      className="inline-flex min-w-max items-center"
    >
      {renderSecretName()}
      {registryTooltip}
    </Badge>
  );
}
