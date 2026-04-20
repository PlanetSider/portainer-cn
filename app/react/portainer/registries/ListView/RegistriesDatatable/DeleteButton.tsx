import { pluralize } from '@/portainer/helpers/strings';
import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton as BaseDeleteButton } from '@@/buttons/DeleteButton';

import { Registry } from '../../types/registry';

import { useDeleteRegistriesMutation } from './useDeleteRegistriesMutation';

export function DeleteButton({ selectedItems }: { selectedItems: Registry[] }) {
  const mutation = useDeleteRegistriesMutation();

  const confirmMessage = getMessage(selectedItems.length);

  return (
    <BaseDeleteButton
      data-cy="registry-removeRegistryButton"
      disabled={selectedItems.length === 0}
      confirmMessage={confirmMessage}
      onConfirmed={handleDelete}
    />
  );

  function handleDelete() {
    mutation.mutate(
      selectedItems.map((item) => item.Id),
      {
        onSuccess() {
          notifySuccess('成功', '镜像仓库已删除');
        },
      }
    );
  }
}

function getMessage(selectedCount: number) {
  const registriesMsg = pluralize(selectedCount, '个镜像仓库', '个镜像仓库');
  return `这些${registriesMsg} 可能正被一个或多个环境中的应用使用。删除后，使用这些镜像仓库的应用可能会发生服务中断。确定要删除所选${registriesMsg}吗？`;
}
