import { RefreshCwIcon } from 'lucide-react';
import { useFormikContext } from 'formik';

import { Card } from '@@/primitives/Card';
import { SwitchField } from '@@/form-components/SwitchField';

import { IntervalField } from '../../../components/IntervalField';

import { SettingsFormValues } from './types';

export function EditPollingWidget() {
  const { values, errors, setFieldValue } =
    useFormikContext<SettingsFormValues>();

  return (
    <Card.Container>
      <Card.Header
        icon={RefreshCwIcon}
        title="轮询"
        subtitle="定期拉取此仓库以检测变更"
      />
      <Card.Body>
        <SwitchField
          label="启用轮询"
          name="pollingEnabled"
          checked={values.pollingEnabled}
          onChange={(value) => setFieldValue('pollingEnabled', value)}
          data-cy="source-polling-switch"
        />
        {values.pollingEnabled && (
          <div className="mb-0 mt-4">
            <IntervalField
              value={values.interval}
              onChange={(value) => setFieldValue('interval', value)}
              errors={errors.interval}
            />
          </div>
        )}
      </Card.Body>
    </Card.Container>
  );
}
