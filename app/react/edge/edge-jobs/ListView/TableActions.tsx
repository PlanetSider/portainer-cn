import { notifySuccess } from '@/portainer/services/notifications';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { EdgeJob } from '../types';

import { useDeleteEdgeJobsMutation } from './useDeleteEdgeJobsMutation';

export function TableActions({
  selectedItems,
}: {
  selectedItems: Array<EdgeJob>;
}) {
  const removeMutation = useDeleteEdgeJobsMutation();

  return (
    <div className="flex items-center gap-2">
      <DeleteButton
        confirmMessage="确定要删除所选 Edge 任务吗？"
        confirmButtonText="删除"
        disabled={selectedItems.length === 0}
        onConfirmed={() => handleRemove(selectedItems)}
        data-cy="remove-edge-jobs-button"
      />

      <AddButton data-cy="add-edge-job-button">添加 Edge 任务</AddButton>
    </div>
  );

  async function handleRemove(selectedItems: Array<EdgeJob>) {
    const ids = selectedItems.map((item) => item.Id);
    removeMutation.mutate(ids, {
      onSuccess: () => {
        notifySuccess('成功', 'Edge 任务已删除');
      },
    });
  }
}
