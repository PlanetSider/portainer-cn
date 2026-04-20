import { RefreshCw } from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { ServiceViewModel } from '@/docker/models/service';
import { Authorized } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { notifySuccess } from '@/portainer/services/notifications';

import { AddButton, Button, ButtonGroup } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { confirmServiceForceUpdate } from '../../common/update-service-modal';

import { useRemoveServicesMutation } from './useRemoveServicesMutation';
import { useForceUpdateServicesMutation } from './useForceUpdateServicesMutation';

export function TableActions({
  selectedItems,
  isAddActionVisible,
  isUpdateActionVisible,
}: {
  selectedItems: Array<ServiceViewModel>;
  isAddActionVisible?: boolean;
  isUpdateActionVisible?: boolean;
}) {
  const environmentId = useEnvironmentId();
  const removeMutation = useRemoveServicesMutation(environmentId);
  const updateMutation = useForceUpdateServicesMutation(environmentId);
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <ButtonGroup>
        {isUpdateActionVisible && (
          <Authorized authorizations="DockerServiceUpdate">
            <Button
              color="light"
              disabled={selectedItems.length === 0}
              onClick={() => handleUpdate(selectedItems)}
              icon={RefreshCw}
              data-cy="service-updateServiceButton"
            >
              更新
            </Button>
          </Authorized>
        )}
        <Authorized authorizations="DockerServiceDelete">
          <DeleteButton
            disabled={selectedItems.length === 0}
            onConfirmed={() => handleRemove(selectedItems)}
            confirmMessage="确定要删除所选服务吗？与这些服务关联的所有容器也将一并删除。"
            confirmButtonText="删除"
            data-cy="service-removeServiceButton"
          />
        </Authorized>
      </ButtonGroup>

      {isAddActionVisible && (
        <Authorized authorizations="DockerServiceCreate">
          <AddButton data-cy="docker-add-service-button">添加服务</AddButton>
        </Authorized>
      )}
    </div>
  );

  async function handleUpdate(selectedItems: Array<ServiceViewModel>) {
      const confirmed = await confirmServiceForceUpdate(
        '确定要强制更新所选服务吗？与这些服务关联的所有任务都将被重新创建。'
      );

    if (!confirmed) {
      return;
    }

    updateMutation.mutate(
      {
        ids: selectedItems.map((service) => service.Id),
        pullImage: confirmed.pullLatest,
      },
      {
        onSuccess() {
          notifySuccess('成功', '服务已成功更新');
          router.stateService.reload();
        },
      }
    );
  }

  async function handleRemove(selectedItems: Array<ServiceViewModel>) {
    removeMutation.mutate(
      selectedItems.map((service) => service.Id),
      {
        onSuccess() {
          notifySuccess('成功', '服务已成功删除');
          router.stateService.reload();
        },
      }
    );
  }
}
