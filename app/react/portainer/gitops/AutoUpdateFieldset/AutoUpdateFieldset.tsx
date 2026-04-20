import { FormikErrors } from 'formik';

import { AutoUpdateModel } from '@/react/portainer/gitops/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { InsightsBox } from '@@/InsightsBox';

import { AutoUpdateSettings } from './AutoUpdateSettings';

export function AutoUpdateFieldset({
  value,
  onChange,
  environmentType,
  isForcePullVisible = true,
  errors,
  baseWebhookUrl,
  webhookId,
  webhooksDocs,
}: {
  value: AutoUpdateModel;
  onChange: (value: AutoUpdateModel) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES';
  isForcePullVisible?: boolean;
  errors?: FormikErrors<AutoUpdateModel>;
  baseWebhookUrl: string;
  webhookId: string;
  webhooksDocs?: string;
}) {
  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="autoUpdate"
            data-cy="gitops-auto-update-switch"
            checked={value.RepositoryAutomaticUpdates}
            label="GitOps 更新"
            tooltip="启用后，在每次轮询间隔或调用 Webhook 时，如果 Git 仓库与上次拉取后本地保存的内容不同，将会部署这些变更。"
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) =>
              handleChange({ RepositoryAutomaticUpdates: value })
            }
          />
        </div>
      </div>

      <InsightsBox
        content={
          <p>
            我们已将“自动更新”更名为“GitOps 更新”，以更贴近行业术语，并让所有用户更清楚其用途。该名称最初是在 GitOps 概念刚兴起时选定的，如今虽然名称已更新，但功能保持不变。GitOps 已迅速成为管理基础设施和应用变更的重要方式，我们希望平台术语也能反映行业的最新发展。
          </p>
        }
        header="认识“GitOps 更新”：原名为“自动更新”"
        insightCloseId="rename-gitops-updates"
        className="mb-3"
      />

      {value.RepositoryAutomaticUpdates && (
        <AutoUpdateSettings
          webhookId={webhookId}
          baseWebhookUrl={baseWebhookUrl}
          value={value}
          onChange={handleChange}
          environmentType={environmentType}
          showForcePullImage={isForcePullVisible}
          errors={errors}
          webhookDocs={webhooksDocs}
        />
      )}
    </>
  );

  function handleChange(newValues: Partial<AutoUpdateModel>) {
    onChange({ ...value, ...newValues });
  }
}
