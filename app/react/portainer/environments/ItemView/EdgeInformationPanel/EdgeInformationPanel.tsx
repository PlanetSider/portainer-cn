import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { InformationPanel } from '@@/InformationPanel';
import { LoadingButton } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';

import { confirmDisassociate } from '../ConfirmDisassociateModel';

import { useDisassociateEnvironment } from './useDisassociateEnvironment';

interface EdgeInformationPanelProps {
  environmentId: EnvironmentId;
  edgeKey: string;
  edgeId: string;
  platformName: string;
  onSuccess?: () => void;
}

export function EdgeInformationPanel({
  environmentId,
  edgeKey,
  edgeId,
  platformName,
  onSuccess,
}: EdgeInformationPanelProps) {
  const disassociateMutation = useDisassociateEnvironment(environmentId);

  async function handleDisassociate() {
    const confirmed = await confirmDisassociate();
    if (confirmed) {
      disassociateMutation.mutate(undefined, {
        onSuccess() {
          notifySuccess('环境已解除关联', '环境已成功解除关联');
          onSuccess?.();
        },
      });
    }
  }

  return (
    <InformationPanel title="Edge 信息">
      <div className="text-muted small flex flex-col gap-2">
        <TextTip>
          此 Edge 环境已关联到一个 Edge 环境（{platformName}）。
        </TextTip>
        <p>
          Edge 密钥：<code>{edgeKey}</code>
        </p>
        <p>
          Edge 标识符：<code>{edgeId}</code>
        </p>
        <p>
          <LoadingButton
            size="small"
            color="primary"
            isLoading={disassociateMutation.isLoading}
            loadingText="解除关联中..."
            onClick={handleDisassociate}
            data-cy="disassociate-environment-button"
          >
            解除关联
          </LoadingButton>
        </p>
      </div>
    </InformationPanel>
  );
}
