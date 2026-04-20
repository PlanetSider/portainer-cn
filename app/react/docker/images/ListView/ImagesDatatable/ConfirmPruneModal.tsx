import { useState } from 'react';
import clsx from 'clsx';

import { Modal, OnSubmit, ModalType, openModal } from '@@/modals';
import { Button } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';

import { ImagesListResponse } from '../../queries/useImages';

interface Props {
  onSubmit: OnSubmit<{ pruneAll: boolean }>;
  images?: ImagesListResponse[];
}

function ConfirmPruneModal({ onSubmit, images = [] }: Props) {
  const [pruneAll, setPruneAll] = useState(false);

  const hasUntaggedImages = images.some(
    (img) => !img.tags || img.tags.length === 0
  );
  const hasUnusedImages = images.some((img) => !img.used);
  const showValidationMessage =
    !pruneAll && !hasUntaggedImages && hasUnusedImages;

  return (
    <Modal onDismiss={() => onSubmit()} aria-label="confirm prune images modal">
      <Modal.Header title="确定吗？" modalType={ModalType.Destructive} />
      <Modal.Body>
        <p>
          这将删除当前环境中所有未打标签的悬空镜像。
        </p>
        <SwitchField
          name="pruneAll"
          data-cy="prune-all-unused-switch"
          label="删除所有未使用镜像"
          tooltip="删除所有未使用的镜像，即使它们带有标签。"
          checked={pruneAll}
          onChange={setPruneAll}
        />
        <p
          className={clsx(
            'text-muted mt-1 text-xs',
            // use invisible class to avoid layout shift
            showValidationMessage ? 'visible' : 'invisible'
          )}
        >
          当前没有可删除的未打标签悬空镜像。
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => onSubmit()}
          color="default"
          data-cy="prune-cancel"
        >
          取消
        </Button>
        <Button
          onClick={() => onSubmit({ pruneAll })}
          color="danger"
          data-cy="prune-confirm"
        >
          继续
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export async function confirmPruneImages(images?: ImagesListResponse[]) {
  return openModal(ConfirmPruneModal, { images });
}
