import { Field, useField } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

export function EnvironmentUrlField({
  placeholderPort = '9001',
  isAgent,
  disabled,
  optional,
}: {
  placeholderPort?: string;
  isAgent?: boolean;
  disabled?: boolean;
  optional?: boolean;
}) {
  const [, meta] = useField('environmentUrl');

  return (
    <FormControl
      label={isAgent ? '环境地址' : '环境 URL'}
      errors={meta.error}
      required={optional}
      inputId="environment-url-field"
      tooltip={
        isAgent
          ? 'Portainer agent 的地址，格式为 <HOST>:<PORT> 或 <IP>:<PORT>'
          : 'Docker 主机的 URL 或 IP 地址。Docker API 必须通过 TCP 端口暴露。请参考 Docker 文档完成配置。'
      }
    >
      <Field
        id="environment-url-field"
        name="environmentUrl"
        as={Input}
        placeholder={`e.g. 10.0.0.10:${placeholderPort} or tasks.portainer_agent:${placeholderPort}`}
        data-cy="endpointCreate-endpointUrlAgentInput"
        disabled={disabled}
      />
    </FormControl>
  );
}
