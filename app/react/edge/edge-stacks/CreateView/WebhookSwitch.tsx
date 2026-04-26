import { TextTip } from '@@/Tip/TextTip';
import { SwitchField } from '@@/form-components/SwitchField';

export function WebhookSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <div className="form-section-title"> Webhook 回调 </div>
      <SwitchField
        label="创建 Edge 堆栈 Webhook"
        checked={value}
        onChange={onChange}
        tooltip="创建一个 Webhook（或回调 URI）以自动更新该堆栈。向此回调 URI 发送 POST 请求（无需认证）后，将拉取关联镜像的最新版本并重新部署该堆栈。"
        labelClass="col-sm-3 col-lg-2"
        data-cy="webhook-switch"
      />

      {value && (
        <TextTip>
          向 Webhook 发送环境变量时，会使用新的变量值更新该堆栈。新的变量名会被添加到堆栈中，已有变量则会被更新。
        </TextTip>
      )}
    </div>
  );
}
