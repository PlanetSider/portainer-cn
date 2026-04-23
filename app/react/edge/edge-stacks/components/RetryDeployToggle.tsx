import { SwitchField } from '@@/form-components/SwitchField';

export function RetryDeployToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <SwitchField
          checked={value}
          data-cy="edge-stack-retry-deploy-toggle"
          name="retryDeploy"
          label="重试部署"
          tooltip="启用后，如果首次部署失败，Edge Agent 将允许自动重试部署。"
          labelClass="col-sm-3 col-lg-2"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
