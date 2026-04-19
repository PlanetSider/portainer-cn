import { RotateCw } from 'lucide-react';
import { Pod } from 'kubernetes-types/core/v1';
import { useRouter } from '@uirouter/react';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess, notifyError } from '@/portainer/services/notifications';
import { Authorized } from '@/react/hooks/useUser';

import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';
import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';

import { Application } from '../../types';
import {
  applicationIsKind,
  matchLabelsToLabelSelectorValue,
} from '../../utils';
import { useRedeployApplicationMutation } from '../../queries/useRedeployApplicationMutation';

type Props = {
  environmentId: EnvironmentId;
  namespace: string;
  appName: string;
  app?: Application;
};

export function RedeployApplicationButton({
  environmentId,
  namespace,
  appName,
  app,
}: Props) {
  const router = useRouter();
  const redeployAppMutation = useRedeployApplicationMutation(
    environmentId,
    namespace,
    appName
  );

  return (
    <Authorized authorizations="K8sPodDelete">
      <Button
        type="button"
        size="small"
        color="light"
        className="!ml-0"
        disabled={redeployAppMutation.isLoading || !app}
        onClick={() => redeployApplication()}
        data-cy="k8sAppDetail-redeployButton"
      >
        <Icon icon={RotateCw} className="mr-1" />
        重新部署
      </Button>
    </Authorized>
  );

  async function redeployApplication() {
    // validate
    if (!app || applicationIsKind<Pod>('Pod', app)) {
      return;
    }
    try {
      if (!app?.spec?.selector?.matchLabels) {
        throw new Error(
          `应用缺少 'matchLabels' 选择器，无法重新部署 Pod。`
        );
      }
    } catch (error) {
       notifyError('失败', error as Error);
      return;
    }

    // confirm the action
    const confirmed = await confirm({
      title: '确定吗？',
      modalType: ModalType.Warn,
      confirmButton: buildConfirmButton('重新部署'),
      message:
        '重新部署会终止并重启该应用，这会导致服务中断。是否继续？',
    });
    if (!confirmed) {
      return;
    }

    // using the matchlabels object, delete the associated pods with redeployAppMutation
    const labelSelector = matchLabelsToLabelSelectorValue(
      app?.spec?.selector?.matchLabels
    );
    redeployAppMutation.mutateAsync(
      { labelSelector },
      {
        onSuccess: () => {
          notifySuccess('成功', '应用重新部署成功');
          router.stateService.reload();
        },
      }
    );
  }
}
