import {
  EnvVarValues,
  EnvironmentVariablesPanel,
} from '@@/form-components/EnvironmentVariablesFieldset';
import { ArrayError } from '@@/form-components/InputList/InputList';

export function EnvVarsTab({
  values,
  onChange,
  errors,
}: {
  values: EnvVarValues;
  onChange(value: EnvVarValues): void;
  errors?: ArrayError<EnvVarValues>;
}) {
  return (
    <div className="form-group">
      <EnvironmentVariablesPanel
        values={values}
        explanation="这些值会在部署时应用到容器中"
        onChange={handleChange}
        errors={errors}
      />
    </div>
  );

  function handleChange(values: EnvVarValues) {
    onChange(values);
  }
}
