import { notifySuccess } from '@/portainer/services/notifications';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { EdgeGroup } from '../types';

import { useDeleteEdgeGroupsMutation } from './useDeleteEdgeGroupMutation';

export function TableActions({
  selectedItems,
}: {
  selectedItems: Array<EdgeGroup>;
}) {
  const removeMutation = useDeleteEdgeGroupsMutation();

  return (
    <div className="flex items-center gap-2">
      <DeleteButton
        confirmMessage="确定要删除所选 Edge 分组吗？"
        confirmButtonText="删除"
        disabled={selectedItems.length === 0}
        onConfirmed={() => handleRemove(selectedItems)}
        data-cy="remove-edge-group-button"
      />

      <AddButton data-cy="add-edge-group-button">添加 Edge 分组</AddButton>
    </div>
  );

  async function handleRemove(selectedItems: Array<EdgeGroup>) {
    const ids = selectedItems.map((item) => item.Id);
    removeMutation.mutate(ids, {
      onSuccess: () => {
        notifySuccess('成功', 'Edge 分组已删除');
      },
    });
  }
}
