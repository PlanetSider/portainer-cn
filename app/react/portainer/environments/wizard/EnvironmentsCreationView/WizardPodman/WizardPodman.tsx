import { useState } from 'react';
import { Zap, Plug2 } from 'lucide-react';
import _ from 'lodash';

import {
  ContainerEngine,
  Environment,
} from '@/react/portainer/environments/types';
import { commandsTabs } from '@/react/edge/components/EdgeScriptForm/scripts';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import EdgeAgentStandardIcon from '@/react/edge/components/edge-agent-standard.svg?c';
import EdgeAgentAsyncIcon from '@/react/edge/components/edge-agent-async.svg?c';

import { BoxSelector, type BoxSelectorOption } from '@@/BoxSelector';
import { BadgeIcon } from '@@/BadgeIcon';
import { TextTip } from '@@/Tip/TextTip';
import { FormSection } from '@@/form-components/FormSection';
import { Badge } from '@@/Badge';
import { ExternalLink } from '@@/ExternalLink';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

import { AnalyticsStateKey } from '../types';
import { EdgeAgentTab } from '../shared/EdgeAgentTab';

import { AgentTab } from './AgentTab';
import { SocketTab } from './SocketTab';

interface Props {
  onCreate(environment: Environment, analytics: AnalyticsStateKey): void;
}

type CreationType = 'agent' | 'socket' | 'edgeAgentStandard' | 'edgeAgentAsync';

const primaryOptions: BoxSelectorOption<CreationType>[] = _.compact([
  {
    id: 'edgeAgentStandard',
    icon: <BadgeIcon icon={EdgeAgentStandardIcon} size="3xl" />,
    label: '边缘代理标准模式',
    description: (
      <>
        <span>
          <Badge type="infoSecondary">推荐</Badge>{' '}
          <Badge type="infoSecondary">支持策略</Badge>
        </span>
        <span className="mt-1 block">
          远程环境会主动与 Portainer 服务端建立连接，并可按需打开安全隧道进行实时交互。Portainer 服务端必须可从边缘代理所在环境访问。
        </span>
      </>
    ),
    value: 'edgeAgentStandard',
  },
  isBE && {
    id: 'edgeAgentAsync',
    icon: <BadgeIcon icon={EdgeAgentAsyncIcon} size="3xl" />,
    label: '边缘代理异步模式',
    description:
      '远程环境会主动与 Portainer 服务端建立连接，但无法打开实时隧道。Portainer 服务端必须可从边缘代理所在环境访问。',
    value: 'edgeAgentAsync',
  },
]);

const legacyOptions: BoxSelectorOption<CreationType>[] = [
  {
    id: 'agent',
    icon: <BadgeIcon icon={Zap} size="3xl" />,
    label: 'Agent',
      description:
        'Portainer 服务端会主动连接远程环境。远程环境中的代理必须可从 Portainer 服务端所在环境访问。',
    value: 'agent',
  },
  {
    id: 'socket',
    icon: <BadgeIcon icon={Plug2} size="3xl" />,
    label: 'Socket',
    description: '通过 Podman socket 直接连接到该环境。',
    value: 'socket',
  },
];

const containerEngine = ContainerEngine.Podman;

export function WizardPodman({ onCreate }: Props) {
  const edgeAgentDocsUrl = useDocsUrl(
    '/faqs/getting-started/why-do-we-recommend-using-the-edge-agent-instead-of-the-traditional-agent'
  );
  const podmanSupportDocsUrl = useDocsUrl(
    '/faqs/installing/does-portainer-support-podman'
  );
  const [creationType, setCreationType] = useState<CreationType>(
    primaryOptions[0].value
  );

  const tab = getTab(creationType);

  return (
    <div className="form-horizontal">
      <BoxSelector
        onChange={(v) => setCreationType(v)}
        options={primaryOptions}
        value={creationType}
        radioName="creation-type"
        className="!-mb-2"
      />

      <FormSection
        key="legacy-options"
        title="更多选项"
        titleSize="sm"
        isFoldable
        defaultFolded={false}
        className="mb-8"
      >
        <p className="text-muted mb-2 text-xs">
          这些是旧版选项，不支持 Edge 功能或策略管理。对于大多数使用场景，{' '}
          <ExternalLink
            to={edgeAgentDocsUrl}
            data-cy="wizard-edge-agent-docs-link"
          >
            推荐使用边缘代理
          </ExternalLink>
        </p>
        <BoxSelector
          onChange={(v) => setCreationType(v)}
          options={legacyOptions}
          value={creationType}
          radioName="creation-type"
        />
      </FormSection>

      <TextTip color="orange" className="mb-2" inline={false}>
        Portainer connects to Podman through Podman&apos;s{' '}
        <b>Docker-compatible API</b> and only supports <b>Podman 5</b> running
        in rootful (privileged) mode on <b>CentOS 9</b> Linux environments.
        Rootless mode and other Linux distros may work, but aren&apos;t
        officially supported.{' '}
        <ExternalLink
          to={podmanSupportDocsUrl}
          data-cy="wizard-podman-support-docs-link"
        >
          Supported Podman configurations
        </ExternalLink>
      </TextTip>
      {tab}
    </div>
  );

  function getTab(creationType: CreationType) {
    switch (creationType) {
      case 'agent':
        return (
          <AgentTab
            onCreate={(environment) => onCreate(environment, 'podmanAgent')}
          />
        );
      case 'socket':
        return (
          <SocketTab
            onCreate={(environment) =>
              onCreate(environment, 'podmanLocalEnvironment')
            }
          />
        );
      case 'edgeAgentStandard':
        return (
          <EdgeAgentTab
            onCreate={(environment) =>
              onCreate(environment, 'podmanEdgeAgentStandard')
            }
            commands={[commandsTabs.podmanLinux]}
            containerEngine={containerEngine}
          />
        );
      case 'edgeAgentAsync':
        return (
          <EdgeAgentTab
            asyncMode
            onCreate={(environment) =>
              onCreate(environment, 'podmanEdgeAgentAsync')
            }
            commands={[commandsTabs.podmanLinux]}
            containerEngine={containerEngine}
          />
        );
      default:
        return null;
    }
  }
}
