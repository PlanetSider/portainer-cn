import { MultiValue } from 'react-select';

import { Registry } from '@/react/portainer/registries/types/registry';
import { useCurrentUser } from '@/react/hooks/useUser';

import { Select } from '@@/form-components/ReactSelect';
import { Link } from '@@/Link';

interface Props {
  value: MultiValue<Registry>;
  onChange(value: MultiValue<Registry>): void;
  options?: Registry[];
  inputId?: string;
  isEditingDisabled?: boolean;
}

export function RegistriesSelector({
  value,
  onChange,
  options = [],
  inputId,
  isEditingDisabled,
}: Props) {
  const { isPureAdmin } = useCurrentUser();

  if (options.length === 0) {
    return (
      <p className="text-muted mb-1 mt-2 text-xs">
        {isPureAdmin ? (
          <span>
            没有可用镜像仓库。前往{' '}
            <Link
              to="portainer.registries"
              target="_blank"
              data-cy="namespace-permissions-registries-selector"
            >
              镜像仓库页面
            </Link>{' '}
            去定义一个容器镜像仓库。
          </span>
        ) : (
          <span>
            没有可用镜像仓库。请联系管理员创建容器镜像仓库。
          </span>
        )}
      </p>
    );
  }

  if (isEditingDisabled) {
    return (
      <p className="text-muted mb-1 mt-2 text-xs">
        {value.length === 0 ? '无' : value.map((v) => v.Name).join(', ')}
      </p>
    );
  }

  return (
    <Select
      isMulti
      getOptionLabel={(option) => option.Name}
      getOptionValue={(option) => String(option.Id)}
      options={options}
      value={value}
      closeMenuOnSelect={false}
      onChange={onChange}
      inputId={inputId}
      data-cy="namespaceCreate-registrySelect"
      id="namespaceCreate-registrySelect"
      placeholder="选择一个或多个镜像仓库"
      isDisabled={isEditingDisabled}
    />
  );
}
