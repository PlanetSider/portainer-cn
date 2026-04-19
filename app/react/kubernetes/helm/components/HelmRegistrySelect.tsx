import { GroupBase } from 'react-select';

import {
  PortainerSelect,
  Option,
} from '@/react/components/form-components/PortainerSelect';
import { useCurrentUser } from '@/react/hooks/useUser';
import { RegistryTypes } from '@/react/portainer/registries/types/registry';

import { FormControl } from '@@/form-components/FormControl';
import { Alert } from '@@/Alert';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

export type RepoValue = {
  repoUrl?: string; // set for traditional https helm repos
  name?: string;
  type?: RegistryTypes;
};

interface Props {
  selectedRegistry: RepoValue | null;
  onRegistryChange: (registry: RepoValue | null) => void;
  namespace?: string;
  placeholder?: string;
  'data-cy'?: string;
  isRepoAvailable: boolean;
  isLoading: boolean;
  isError: boolean;
  repoOptions: GroupBase<Option<RepoValue>>[];
}

export function HelmRegistrySelect({
  selectedRegistry,
  onRegistryChange,
  namespace,
  placeholder = '选择仓库',
  'data-cy': dataCy = 'helm-registry-select',
  isRepoAvailable,
  isLoading,
  isError,
  repoOptions,
}: Props) {
  const { isPureAdmin } = useCurrentUser();

  return (
    <FormControl
      label="Helm Chart 来源"
      tooltip={<HelmChartSourceTooltip isPureAdmin={isPureAdmin} />}
    >
      <PortainerSelect<RepoValue>
        placeholder={placeholder}
        value={selectedRegistry ?? {}}
        options={repoOptions}
        isLoading={isLoading}
        onChange={onRegistryChange}
        isClearable
        bindToBody
        data-cy={dataCy}
      />
      <NoReposWarning
        hasNoRepos={!isRepoAvailable}
        isLoading={isLoading}
        namespace={namespace}
        isPureAdmin={isPureAdmin}
      />
      {isError && <Alert color="error">无法加载镜像仓库选项。</Alert>}
    </FormControl>
  );
}

function HelmChartSourceTooltip({ isPureAdmin }: { isPureAdmin: boolean }) {
  if (isPureAdmin) {
    return (
      <>
        <CreateUserRepoMessage />
        <br />
        <CreateGlobalRepoMessage />
      </>
    );
  }

  // Non-admin
  return <CreateUserRepoMessage />;
}

function NoReposWarning({
  hasNoRepos,
  isLoading,
  namespace,
  isPureAdmin,
}: {
  hasNoRepos: boolean;
  isLoading: boolean;
  namespace?: string;
  isPureAdmin: boolean;
}) {
  if (!hasNoRepos || isLoading || !namespace) {
    return null;
  }

  return (
    <TextTip color="blue" className="mt-2">
      没有可用仓库。
      <CreateRepoMessage isPureAdmin={isPureAdmin} />
    </TextTip>
  );
}

function CreateRepoMessage({ isPureAdmin }: { isPureAdmin: boolean }) {
  if (isPureAdmin) {
    return (
      <>
        <CreateUserRepoMessage />
        <br />
        <CreateGlobalRepoMessage />
      </>
    );
  }

  // Non-admin
  return <CreateUserRepoMessage />;
}

function CreateUserRepoMessage() {
  return (
    <>
      你可以在{' '}
      <Link
        to="portainer.account"
        params={{ '#': 'helm-repositories' }}
        data-cy="helm-repositories-link"
      >
        用户设置 - Helm 仓库
      </Link>
      中定义 <b>repositories</b>。
    </>
  );
}

function CreateGlobalRepoMessage() {
  return (
    <>
      你也可以在{' '}
      <Link
        to="portainer.settings"
        params={{ '#': 'kubernetes-settings' }}
        data-cy="portainer-settings-link"
        target="_blank"
      >
        Portainer 设置
      </Link>
      中定义仓库。
    </>
  );
}
