import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useInfoPanelState } from '@/react/hooks/useInfoPanelState';

import { InformationPanel } from '@@/InformationPanel';
import { TextTip } from '@@/Tip/TextTip';
import { HelpLink } from '@@/HelpLink';

import { useInfo } from '../proxy/queries/useInfo';

const infoPanelId = 'docker-dashboard-info-01';

export function NonAgentSwarmInfo() {
  const { isVisible, dismiss } = useInfoPanelState(infoPanelId);
  const envId = useEnvironmentId();
  const isManagerQuery = useInfo(envId, {
    select: (info) => !!info.Swarm?.ControlAvailable,
  });
  if (!isVisible || isManagerQuery.isLoading) {
    return null;
  }

  const isManager = isManagerQuery.data;

  return (
    <InformationPanel title="说明" onDismiss={() => dismiss()}>
      <TextTip color="blue">
        {isManager ? (
          <>
            Portainer 当前连接到一个属于 Swarm 集群的节点。集群中其他节点上的某些资源可能无法被管理，请参考{' '}
            <HelpLink
              docLink="/admin/environments/add/swarm/agent"
              target="_blank"
            >
              Agent 部署文档
            </HelpLink>{' '}
            了解更多详情。
          </>
        ) : (
          <>
            Portainer 当前连接到一个 worker 节点，因此无法使用 Swarm 管理功能。
          </>
        )}
      </TextTip>
    </InformationPanel>
  );
}
