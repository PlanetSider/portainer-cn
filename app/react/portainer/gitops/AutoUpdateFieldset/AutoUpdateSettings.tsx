import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { type AutoUpdateModel } from '@/react/portainer/gitops/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

import { ForceDeploymentSwitch } from './ForceDeploymentSwitch';
import { WebhookSettings } from './WebhookSettings';

export function AutoUpdateSettings({
  value,
  onChange,
  environmentType,
  showForcePullImage,
  baseWebhookUrl,
  webhookId,
  webhookDocs,
}: {
  value: AutoUpdateModel;
  onChange: (value: Partial<AutoUpdateModel>) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES';
  showForcePullImage: boolean;
  baseWebhookUrl: string;
  webhookId: string;
  webhookDocs?: string;
}) {
  return (
    <>
      <WebhookSettings
        baseUrl={baseWebhookUrl}
        value={webhookId}
        docsLink={webhookDocs}
      />

      <TextTip color="orange" className="mb-2">
        通过 Portainer 在本地，或直接在集群中对该堆栈/应用所做的任何更改，都将被 Git 仓库中的内容覆盖，这可能会导致服务中断。
      </TextTip>

      {showForcePullImage && (
        <div className="form-group">
          <div className="col-sm-12">
            <SwitchField
              name="forcePullImage"
              data-cy="gitops-force-pull-image-switch"
              featureId={FeatureId.STACK_PULL_IMAGE}
              checked={value.ForcePullImage || false}
               label="重新拉取镜像"
              labelClass="col-sm-3 col-lg-2"
               tooltip="启用后，当通过 Webhook 或轮询触发重新部署时，如果存在带有所指定标签的更新镜像（例如会变化的开发版本），则会重新拉取并部署该镜像。如果你未指定标签，或指定的标签为“latest”，则会拉取并重新部署带有“latest”标签的镜像。"
              onChange={(value) => onChange({ ForcePullImage: value })}
            />
          </div>
        </div>
      )}

      <ForceDeploymentSwitch
        checked={value.RepositoryAutomaticUpdatesForce || false}
        onChange={(value) =>
          onChange({ RepositoryAutomaticUpdatesForce: value })
        }
        label={
          environmentType === 'KUBERNETES' ? '始终应用 Manifest' : undefined
        }
        tooltip={
          environmentType === 'KUBERNETES' ? (
            <>
              <p>
                启用后，当通过 Webhook 或轮询触发重新部署时，将始终执行 kubectl apply，即使 Portainer 检测到 Git 仓库与上次拉取后本地保存的内容没有差异。
              </p>
              <p>
                如果你希望 Git 仓库作为唯一可信来源，并接受直接在集群资源上所做的更改被覆盖，那么此选项会很有用。
              </p>
            </>
          ) : (
            <p>
              启用后，当通过 Webhook 或轮询触发重新部署时，堆栈将始终重新部署，即使 Portainer 检测到 Git 仓库与上次拉取后本地保存的内容没有差异。
            </p>
          )
        }
      />
    </>
  );
}
