import { LinkIcon } from 'lucide-react';
import { useFormikContext } from 'formik';

import { Card } from '@@/primitives/Card';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';

import { SettingsFormValues } from './types';

export function EditConnectionDetailsWidget() {
  const { values, errors, setFieldValue } =
    useFormikContext<SettingsFormValues>();

  return (
    <Card.Container>
      <Card.Header
        icon={LinkIcon}
        title="连接详情"
        subtitle="来源名称、URL 和连接设置"
      />
      <Card.Body>
        <FormControl inputId="name" label="名称" errors={errors.name} required>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => setFieldValue('name', e.target.value)}
            data-cy="source-name-input"
          />
        </FormControl>
        <FormControl
          inputId="url"
          label="Repository URL"
          errors={errors.url}
          required
        >
          <Input
            id="url"
            name="url"
            value={values.url}
            onChange={(e) => setFieldValue('url', e.target.value)}
            data-cy="source-url-input"
          />
        </FormControl>
        <SwitchField
          label="跳过 TLS 验证"
          name="tlsSkipVerify"
          checked={values.tlsSkipVerify}
          onChange={(checked) => setFieldValue('tlsSkipVerify', checked)}
          data-cy="source-tls-skip-verify"
        />
      </Card.Body>
    </Card.Container>
  );
}
