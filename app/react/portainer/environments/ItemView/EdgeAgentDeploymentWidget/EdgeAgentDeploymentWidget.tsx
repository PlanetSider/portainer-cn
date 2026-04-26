import { compact } from 'lodash';

import { EdgeScriptForm } from '@/react/edge/components/EdgeScriptForm';
import { commandsTabs } from '@/react/edge/components/EdgeScriptForm/scripts';
import { EdgeKeyDisplay } from '@/react/portainer/environments/ItemView/EdgeKeyDisplay';

import { FormSection } from '@@/form-components/FormSection';
import { Widget, WidgetBody } from '@@/Widget';
import { TextTip } from '@@/Tip/TextTip';

interface Props {
  edgeKey: string;
  edgeId?: string;
  asyncMode?: boolean;
}

interface EdgeKeyDetails {
  instanceURL: string;
  tunnelServerAddr: string;
}

export function EdgeAgentDeploymentWidget({
  edgeKey,
  edgeId,
  asyncMode,
}: Props) {
  const edgeScriptCommands = {
    linux: compact([
      commandsTabs.k8sLinux,
      commandsTabs.swarmLinux,
      commandsTabs.standaloneLinux,
      commandsTabs.podmanLinux,
    ]),
    win: [commandsTabs.swarmWindows, commandsTabs.standaloneWindow],
  };

  const edgeKeyDetails = decodeEdgeKey(edgeKey);

  return (
    <Widget>
      <WidgetBody>
        <FormSection title="部署 Agent">
          <TextTip color="blue">
            请参考下方与平台对应的命令，在你的远程集群中部署 Edge Agent。
            <br />
            Agent 将通过 <u>{edgeKeyDetails.instanceURL}</u> 和{' '}
            <u>tcp://{edgeKeyDetails.tunnelServerAddr}</u> 与 Portainer 通信。
          </TextTip>
        </FormSection>

        <FormSection title="Edge Agent 部署脚本">
          <EdgeScriptForm
            edgeInfo={{ key: edgeKey, id: edgeId }}
            commands={edgeScriptCommands}
            asyncMode={asyncMode}
          />
        </FormSection>

        <EdgeKeyDisplay edgeKey={edgeKey} />
      </WidgetBody>
    </Widget>
  );
}

function decodeEdgeKey(key: string): EdgeKeyDetails {
  if (!key) {
    return { instanceURL: '', tunnelServerAddr: '' };
  }

  try {
    const decodedKey = atob(key).split('|');
    return {
      instanceURL: decodedKey[0] || '',
      tunnelServerAddr: decodedKey[1] || '',
    };
  } catch {
    // Invalid base64, return empty strings
    return { instanceURL: '', tunnelServerAddr: '' };
  }
}
