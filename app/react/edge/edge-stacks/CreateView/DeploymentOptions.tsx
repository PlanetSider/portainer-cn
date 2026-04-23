import { SwitchField } from '@@/form-components/SwitchField';

import { FormValues } from './types';

export function DeploymentOptions({
  setFieldValue,
  values,
}: {
  values: FormValues;
  setFieldValue: <T>(field: string, value: T) => void;
}) {
  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.prePullImage}
            name="prePullImage"
            label="预拉取镜像"
            tooltip="启用后，镜像会在部署开始前预先拉取。这在镜像下载可能延迟或间歇失败、从而导致部署失败的场景下很有帮助。"
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) => setFieldValue('prePullImage', value)}
            data-cy="pre-pull-images-switch"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.retryDeploy}
            name="retryDeploy"
            label="重试部署"
            tooltip="启用后，如果首次部署失败，Edge Agent 将允许自动重试部署。"
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) => setFieldValue('retryDeploy', value)}
            data-cy="retry-deployment-switch"
          />
        </div>
      </div>
    </>
  );
}
