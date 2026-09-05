import { useRouter } from '@uirouter/react';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton } from '@@/buttons/DeleteButton';

import { useUninstallHelmAppMutation } from '../../helmReleaseQueries/useUninstallHelmAppMutation';

export function UninstallButton({
  environmentId,
  releaseName,
  namespace,
}: {
  environmentId: EnvironmentId;
  releaseName: string;
  namespace?: string;
}) {
  const uninstallHelmAppMutation = useUninstallHelmAppMutation(environmentId);
  const router = useRouter();

  return (
    <DeleteButton
      size="medium"
      data-cy="k8sApp-removeHelmChartButton"
      isLoading={uninstallHelmAppMutation.isLoading}
      confirmMessage="确定要移除所选 Helm Chart 吗？这将删除与该 Helm Chart 关联的所有资源。"
      onConfirmed={handleUninstall}
    >
      卸载
    </DeleteButton>
  );

  function handleUninstall() {
    uninstallHelmAppMutation.mutate(
      { releaseName, namespace },
      {
        onSuccess: () => {
          router.stateService.go('kubernetes.applications', {
            endpointId: environmentId,
          });
          notifySuccess('成功', 'Helm Chart 卸载成功');
        },
      }
    );
  }
}
