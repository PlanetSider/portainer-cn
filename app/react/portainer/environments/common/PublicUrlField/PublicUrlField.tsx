import { Field, useField } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

export function PublicUrlField() {
  const [, meta] = useField('publicUrl');

  return (
    <FormControl
      label="公网 IP"
      inputId="public-url-field"
      errors={meta.error}
      tooltip="暴露的容器可访问的 URL 或 IP 地址。此字段为可选项，默认将使用环境 URL。"
    >
      <Field
        id="public-url-field"
        name="publicUrl"
        as={Input}
        placeholder="例如：10.0.0.10 或 mydocker.mydomain.com"
        data-cy="public-url-input"
      />
    </FormControl>
  );
}
