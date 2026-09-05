import { ChevronDown, Trash2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuPopover } from '@reach/menu-button';
import { positionRight } from '@reach/popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Authorized } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { getAllSettledItems } from '@/portainer/helpers/promise-utils';
import { pluralize } from '@/portainer/helpers/strings';

import { Button, ButtonGroup } from '@@/buttons';
import { ButtonWithRef } from '@@/buttons/Button';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

import { ImagesListResponse } from '../../queries/useImages';
import { queryKeys } from '../../queries/queryKeys';
import { deleteImage } from '../../queries/useDeleteImageMutation';

export function RemoveButtonMenu({
  selectedItems,
}: {
  selectedItems: Array<ImagesListResponse>;
}) {
  const deleteImageListMutation = useDeleteImageListMutation();

  return (
    <Authorized authorizations="DockerImageDelete">
      <ButtonGroup>
        <Button
          size="small"
          color="dangerlight"
          icon={Trash2}
          disabled={selectedItems.length === 0}
          data-cy="image-removeImageButton"
          onClick={() => {
            handleRemove(false);
          }}
        >
          删除
        </Button>
        <Menu>
          <MenuButton
            as={ButtonWithRef}
            size="small"
            color="dangerlight"
            disabled={selectedItems.length === 0}
            icon={ChevronDown}
            data-cy="image-toggleRemoveButtonMenu"
          >
            <span className="sr-only">切换下拉菜单</span>
          </MenuButton>
          <MenuPopover position={positionRight}>
            <div className="mt-3 bg-white th-highcontrast:bg-black th-dark:bg-black">
              <MenuItem
                onSelect={() => {
                  handleRemove(true);
                }}
              >
                强制删除
              </MenuItem>
            </div>
          </MenuPopover>
        </Menu>
      </ButtonGroup>
    </Authorized>
  );

  function confirmForceRemove() {
    return confirmDestructive({
      title: '确定吗？',
      message:
        '强制删除镜像时，即使该镜像正被已停止的容器使用，也会将其移除，并删除所有关联标签。确定要删除所选镜像吗？',
      confirmButton: buildConfirmButton('删除镜像', 'danger'),
    });
  }

  function confirmRegularRemove() {
    return confirmDestructive({
      title: '确定吗？',
      message:
        '删除镜像时也会删除所有关联标签。确定要删除所选镜像吗？',
      confirmButton: buildConfirmButton('删除镜像', 'danger'),
    });
  }

  async function handleRemove(force: boolean) {
    const confirmed = await (force
      ? confirmForceRemove()
      : confirmRegularRemove());

    if (!confirmed) {
      return;
    }

    deleteImageListMutation.mutate({
      images: selectedItems.map((image) => ({
        id: image.id,
        nodeName: image.nodeName,
      })),
      force,
    });
  }
}

type ImageToDelete = { id: string; nodeName?: string };

function useDeleteImageListMutation() {
  const environmentId = useEnvironmentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      images,
      force,
    }: {
      images: Array<ImageToDelete>;
      force?: boolean;
    }) =>
      getAllSettledItems(images, (image) =>
        deleteImage({
          environmentId,
          imageId: image.id,
          nodeName: image.nodeName,
          force,
        })
      ),
    onSuccess: ({ fulfilledItems, rejectedItems }) => {
      // one error notification per rejected item
      rejectedItems.forEach(({ item, reason }) => {
        notifyError(`Failed to remove image '${item.id}'`, new Error(reason));
      });

      // one success notification for all fulfilled items
      if (fulfilledItems.length) {
        notifySuccess(
          `${pluralize(fulfilledItems.length, 'Image')} successfully removed`,
          fulfilledItems.map((item) => item.id).join(', ')
        );
      }

      return queryClient.invalidateQueries(queryKeys.base(environmentId));
    },
  });
}
