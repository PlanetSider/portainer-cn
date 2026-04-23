import { useFormikContext } from 'formik';
import { Calendar, Edit } from 'lucide-react';

import { FormSection } from '@@/form-components/FormSection';
import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';

import { FormValues } from '../../CreateView/types';

import { AdvancedCronFieldset } from './AdvancedCronFieldset';
import { BasicCronFieldset } from './BasicCronFieldset';

export const cronMethodOptions: ReadonlyArray<BoxSelectorOption<string>> = [
  {
    id: 'config_basic',
    value: 'basic',
    icon: Calendar,
    iconType: 'badge',
      label: '基础配置',
      description: '从日历中选择时间',
  },
  {
    id: 'config_advanced',
    value: 'advanced',
    icon: Edit,
    iconType: 'badge',
      label: '高级配置',
      description: '自定义 Cron 规则',
  },
] as const;

export function JobConfigurationFieldset() {
  const { values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <>
      <FormSection title="边缘任务配置">
        <BoxSelector
          slim
          radioName="configuration"
          value={values.cronMethod}
          options={cronMethodOptions}
          onChange={(value) => {
            setFieldValue('cronMethod', value);
            setFieldValue('cronExpression', '');
          }}
        />
      </FormSection>

      {values.cronMethod === 'basic' ? (
        <BasicCronFieldset />
      ) : (
        <AdvancedCronFieldset />
      )}
    </>
  );
}
