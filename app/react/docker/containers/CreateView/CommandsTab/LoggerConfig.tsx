import { FormikErrors } from 'formik';
import { array, object, SchemaOf, string } from 'yup';
import _ from 'lodash';

import { useLoggingPlugins } from '@/react/docker/proxy/queries/usePlugins';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useIsPodman } from '@/react/portainer/environments/queries/useIsPodman';

import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { InputGroup } from '@@/form-components/InputGroup';
import { InputList, ItemProps } from '@@/form-components/InputList';
import { PortainerSelect } from '@@/form-components/PortainerSelect';
import { TextTip } from '@@/Tip/TextTip';
import { FormError } from '@@/form-components/FormError';

export interface LogConfig {
  type: string;
  options: Array<{ option: string; value: string }>;
}

export function LoggerConfig({
  value,
  onChange,
  apiVersion,
  errors,
}: {
  value: LogConfig;
  onChange: (value: LogConfig) => void;
  apiVersion: number;
  errors?: FormikErrors<LogConfig>;
}) {
  const envId = useEnvironmentId();
  const isPodman = useIsPodman(envId);
  const isSystem = apiVersion < 1.25;
  const pluginsQuery = useLoggingPlugins(envId, isSystem, isPodman);

  if (!pluginsQuery.data) {
    return null;
  }

  const isDisabled = !value.type || value.type === 'none';

  const pluginOptions = [
    { label: '默认日志驱动', value: '' },
    ...pluginsQuery.data.map((p) => ({ label: p, value: p })),
    { label: 'none', value: 'none' },
  ];

  return (
    <FormSection title="日志">
      <FormControl label="驱动">
        <PortainerSelect
          value={value.type}
          onChange={(type) => onChange({ ...value, type: type || '' })}
          options={pluginOptions}
          data-cy="docker-logging-driver-selector"
        />
      </FormControl>

      <TextTip color="blue">
        这里设置的日志驱动会覆盖 Docker 守护进程的默认日志驱动。
        如果你不想覆盖默认值，请选择“默认日志驱动”。支持的日志驱动可查看{' '}
        <a
          href="https://docs.docker.com/engine/admin/logging/overview/#supported-logging-drivers"
          target="_blank"
          rel="noreferrer"
        >
          Docker 文档
        </a>
        .
      </TextTip>

      <InputList
        tooltip={
          isDisabled
            ? '只有在选择非 none 且非默认的驱动后，才能启用添加按钮。可选参数取决于所选驱动，请参考该驱动文档。'
            : ''
        }
        label="选项"
        onChange={(options) => handleChange({ options })}
        value={value.options}
        item={Item}
        itemBuilder={() => ({ option: '', value: '' })}
        disabled={isDisabled}
        errors={errors?.options}
        data-cy="docker-logging-options"
      />
    </FormSection>
  );

  function handleChange(partial: Partial<LogConfig>) {
    onChange({ ...value, ...partial });
  }
}

function Item({
  item: { option, value },
  onChange,
  error,
  index,
}: ItemProps<{ option: string; value: string }>) {
  return (
    <div>
      <div className="flex w-full gap-4">
        <InputGroup className="w-1/2">
          <InputGroup.Addon>选项名</InputGroup.Addon>
          <InputGroup.Input
            value={option}
            onChange={(e) => handleChange({ option: e.target.value })}
            placeholder="例如：FOO"
            data-cy={`docker-logging-option_${index}`}
          />
        </InputGroup>
        <InputGroup className="w-1/2">
          <InputGroup.Addon>值</InputGroup.Addon>
          <InputGroup.Input
            value={value}
            onChange={(e) => handleChange({ value: e.target.value })}
            placeholder="例如：bar"
            data-cy={`docker-logging-value_${index}`}
          />
        </InputGroup>
      </div>
      {error && <FormError>{_.first(Object.values(error))}</FormError>}
    </div>
  );

  function handleChange(partial: Partial<{ option: string; value: string }>) {
    onChange({ option, value, ...partial });
  }
}

export function validation(): SchemaOf<LogConfig> {
  return object({
    options: array().of(
      object({
        option: string().required('Option is required'),
        value: string().required('Value is required'),
      })
    ),
    type: string().default(''),
  });
}
