import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

type Warnings = {
  quota: boolean;
  ingress: boolean;
  registries: boolean;
};

export function confirmUpdateNamespace(warnings: Warnings) {
  const message = (
    <>
      {warnings.quota && (
        <p>
          降低分配给“正在使用”的命名空间的配额可能会产生意外后果，导致正在运行的应用无法正常工作，甚至完全无法运行。
        </p>
      )}
      {warnings.ingress && (
        <p>
          停用 Ingress 可能导致应用无法访问。受影响应用中的所有 Ingress 配置都将被删除。
        </p>
      )}
      {warnings.registries && (
        <p>
          你移除的某些镜像仓库可能正被此环境中的一个或多个应用使用。移除仓库访问权限可能导致这些应用的服务中断。
        </p>
      )}
      <p>确定要继续吗？</p>
    </>
  );

  return confirm({
    title: '确定吗？',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('更新', 'primary'),
  });
}
