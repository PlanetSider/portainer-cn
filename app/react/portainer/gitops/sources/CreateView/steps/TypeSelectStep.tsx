import { useFormikContext } from 'formik';

import { Widget } from '@@/Widget';
import { BoxSelector } from '@@/BoxSelector';

import { FormValues } from '../type';
import { validationSchema } from '../validation';

import { sourceTypeOptions } from './typeSelectOptions';

export function TypeSelectStep() {
  const { values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <>
      <Widget.Title
        title="选择来源类型"
        subtitle="选择要连接到 Portainer 的外部来源类型。目前仅支持连接 Git Repository；未来版本将支持 Helm Repository、OCI Registry 和 S3 存储桶。"
      />
      <Widget.Body>
        <BoxSelector
          value={values.type}
          onChange={(type) => setFieldValue('type', type)}
          radioName="source-type-selector"
          options={sourceTypeOptions}
        />
      </Widget.Body>
    </>
  );
}

export function validateTypeSelectStep() {
  return validationSchema().pick(['type']);
}
