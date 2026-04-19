import { ExternalLink } from 'lucide-react';

import { Button } from '@@/buttons';
import { Modal } from '@@/modals/Modal';
import { ModalType } from '@@/modals/Modal/types';

export function NonAdminUpgradeDialog({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  return (
    <Modal aria-label="Upgrade Portainer to Business Edition">
      <Modal.Header
        title="请联系管理员"
        modalType={ModalType.Warn}
      />
      <Modal.Body>
        你需要以管理员身份登录，才能将 Portainer 升级到 Business Edition。
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full gap-2">
          <Button
            color="default"
            data-cy="non-admin-cancel-upgrade"
            size="medium"
            className="w-1/3"
            onClick={() => onDismiss()}
          >
            取消
          </Button>

          <a
            href="https://www.portainer.io/take-5"
            target="_blank"
            rel="noreferrer"
            className="no-link w-2/3"
          >
            <Button
              color="primary"
              data-cy="non-admin-learn-about-business-edition"
              size="medium"
              className="w-full"
              icon={ExternalLink}
            >
              了解 Business Edition
            </Button>
          </a>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
