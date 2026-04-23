import { useField } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

export const defaultCronExpression = '0 * * * *' as const;

export const timeOptions = [
  {
    label: '每小时',
    value: defaultCronExpression,
  },
  {
    label: '每 2 小时',
    value: '0 */2 * * *',
  },
  {
    label: '每天',
    value: '0 0 * * *',
  },
] as const;

export function RecurringFieldset() {
  const [{ value, onChange, name, onBlur }, { error }] =
    useField<string>('recurringOption');

  return (
    <FormControl label="边缘任务时间" inputId="edge_job_value" errors={error}>
      <Select
        id="edge_job_value"
        data-cy="edge-job-time-select"
        name={name}
        options={timeOptions}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FormControl>
  );
}
