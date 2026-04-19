import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmRedeploy() {
  return confirm({
    title: '',
    message: (
      <>
        当前有一个或多个应用正在使用此卷。
        <br /> 若要使更改生效，这些应用需要重新部署。是否现在重新调度？
      </>
    ),
    confirmButton: buildConfirmButton('重新部署应用'),
    cancelButtonLabel: '稍后我自己处理',
  });
}
