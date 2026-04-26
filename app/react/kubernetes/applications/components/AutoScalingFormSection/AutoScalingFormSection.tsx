import { FormikErrors } from 'formik';

import { useIsEdgeAdmin } from '@/react/hooks/useUser';

import { SwitchField } from '@@/form-components/SwitchField';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';
import { Input } from '@@/form-components/Input';
import { FormError } from '@@/form-components/FormError';
import { Tooltip } from '@@/Tip/Tooltip';

import { AutoScalingFormValues } from './types';

type Props = {
  values: AutoScalingFormValues;
  onChange: (values: AutoScalingFormValues) => void;
  errors: FormikErrors<AutoScalingFormValues>;
  isMetricsEnabled: boolean;
};

export function AutoScalingFormSection({
  values,
  onChange,
  errors,
  isMetricsEnabled,
}: Props) {
  return (
    <>
      {!isMetricsEnabled && <NoMetricsServerWarning />}
      <SwitchField
        disabled={!isMetricsEnabled}
        data-cy="k8sAppCreate-autoScaleSwitch"
        label="为此应用启用自动扩缩容"
        labelClass="col-sm-3 col-lg-2"
        checked={values.isUsed}
        onChange={(value: boolean) => {
          // when enabling the auto scaler, set the default values
          const newValues =
            !values.isUsed && value
              ? {
                  minReplicas: 1,
                  maxReplicas: 3,
                  targetCpuUtilizationPercentage: 50,
                }
              : {};
          onChange({
            ...values,
            ...newValues,
            isUsed: value,
          });
        }}
      />
      {values.isUsed && (
        <div className="my-3 grid w-full grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-3">
          <div className="flex min-w-fit flex-col">
            <label htmlFor="min-instances" className="text-xs font-normal">
              最小实例数
            </label>
            <Input
              id="min-instances"
              type="number"
              min="1"
              value={values.minReplicas}
              max={values.maxReplicas || 1}
              onChange={(e) =>
                onChange({
                  ...values,
                  minReplicas: e.target.valueAsNumber,
                })
              }
              data-cy="k8sAppCreate-autoScaleMin"
            />
            {errors?.minReplicas && <FormError>{errors.minReplicas}</FormError>}
          </div>
          <div className="flex min-w-fit flex-col">
            <label htmlFor="max-instances" className="text-xs font-normal">
              最大实例数
            </label>
            <Input
              id="max-instances"
              type="number"
              value={values.maxReplicas}
              min={values.minReplicas || 1}
              onChange={(e) =>
                onChange({
                  ...values,
                  maxReplicas: e.target.valueAsNumber,
                })
              }
              data-cy="k8sAppCreate-autoScaleMax"
            />
            {errors?.maxReplicas && <FormError>{errors.maxReplicas}</FormError>}
          </div>
          <div className="flex min-w-fit flex-col">
            <label
              htmlFor="cpu-threshold"
              className="flex items-center text-xs font-normal"
            >
              目标 CPU 使用率 (<b>%</b>)
              <Tooltip message="自动扩缩容器会确保运行足够数量的实例，以维持所有实例的平均 CPU 使用率。" />
            </label>
            <Input
              id="cpu-threshold"
              type="number"
              value={values.targetCpuUtilizationPercentage}
              min="1"
              max="100"
              onChange={(e) =>
                onChange({
                  ...values,
                  targetCpuUtilizationPercentage: e.target.valueAsNumber,
                })
              }
              data-cy="k8sAppCreate-targetCPUInput"
            />
            {errors?.targetCpuUtilizationPercentage && (
              <FormError>{errors.targetCpuUtilizationPercentage}</FormError>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NoMetricsServerWarning() {
  const isAdminQuery = useIsEdgeAdmin();
  if (isAdminQuery.isLoading) {
    return null;
  }

  const { isAdmin } = isAdminQuery;

  return (
      <TextTip color="orange">
        {isAdmin && (
          <>
            必须先在{' '}
            <Link
              to="kubernetes.cluster.setup"
              data-cy="environment-configuration-view"
            >
              环境配置页面
            </Link>
            启用服务器指标功能。
          </>
        )}
        {!isAdmin &&
          '此功能当前已禁用，必须由管理员用户启用。'}
      </TextTip>
  );
}
