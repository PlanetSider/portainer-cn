import parse from 'parse-duration';

import { durationValidation } from '@/react/utils/validation';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { useCaretPosition } from '@@/form-components/useCaretPosition';

export function IntervalField({
  onChange,
  value,
  errors,
}: {
  value: string;
  onChange: (value: string) => void;
  errors?: string;
}) {
  const { ref, updateCaret } = useCaretPosition();

  return (
    <FormControl
      label="拉取间隔"
      inputId="repository_fetch_interval"
      tooltip="指定轮询发生的频率，可使用如下语法：5m = 5 分钟，24h = 24 小时，6h40m = 6 小时 40 分钟。"
      required
      errors={errors}
    >
      <Input
        mRef={ref}
        data-cy="repository-fetch-interval-input"
        id="repository_fetch_interval"
        name="repository_fetch_interval"
        placeholder="5m"
        required
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          updateCaret();
        }}
      />
    </FormControl>
  );
}

export function intervalValidation() {
  return durationValidation(false) // Don't allow empty - field is required
    .required('此字段为必填项。')
    .test('minimumInterval', '最小间隔为 1m', (value) => {
      if (!value) {
        return false;
      }
      const minutes = parse(value, 'minute');
      return minutes !== null && minutes >= 1;
    });
}
