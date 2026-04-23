import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmDisassociate() {
  const message = (
    <>
      <p>
        解除关联此边缘环境后，会将其标记为未关联状态，并清除已注册的边缘 ID。
      </p>
      <p>
        任何使用与此环境关联的边缘密钥启动的代理，都可以重新与此环境建立关联。
      </p>
      <p>
        你可以复用部署现有边缘代理时使用的边缘 ID 和边缘密钥，将新的边缘设备关联到此环境。
      </p>
    </>
  );

  return confirm({
    title: '关于解除关联',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('解除关联'),
  });
}
