import clsx from 'clsx';
import { FormikErrors } from 'formik';

import { FormSection } from '@@/form-components/FormSection';
import { InputList } from '@@/form-components/InputList';
import { ItemProps } from '@@/form-components/InputList/InputList';
import { isErrorType } from '@@/form-components/formikUtils';
import { FormError } from '@@/form-components/FormError';
import { InputGroup } from '@@/form-components/InputGroup';
import { Badge } from '@@/Badge';

import { NodeLabel } from './types';
import { createNewLabel } from './nodeFormUtils';

interface Props {
  labels: NodeLabel[];
  errors: FormikErrors<NodeLabel[]>;
  onChangeLabels: (labels: NodeLabel[]) => void;
  hasNodeWriteAccess: boolean;
}

export function NodeLabels({
  labels,
  onChangeLabels,
  errors,
  hasNodeWriteAccess,
}: Props) {
  return (
    <FormSection title="标签">
      <InputList<NodeLabel>
        value={labels}
        onChange={onChangeLabels}
        data-cy="node-labels-input"
        item={NodeLabelItem}
        addLabel="添加标签"
        canUndoDelete
        itemBuilder={createNewLabel}
        errors={errors}
        readOnly={!hasNodeWriteAccess}
      />
    </FormSection>
  );
}

function NodeLabelItem({
  onChange,
  item,
  error,
  disabled,
  readOnly,
  index,
}: ItemProps<NodeLabel>) {
  const formikError = isErrorType(error) ? error : undefined;
  return (
    <div className="flex flex-wrap items-start gap-2">
      <div className="w-64 flex-none">
        <InputGroup
          size="small"
          className={clsx(item.needsDeletion && 'striked')}
        >
          <InputGroup.Addon>名称</InputGroup.Addon>
          <InputGroup.Input
            placeholder="例如：foo.bar"
            value={item.key}
            onChange={(e) => handleChange('key', e.target.value)}
            disabled={disabled || item.isSystem}
            readOnly={readOnly}
            type="text"
            data-cy={`node-label-key-input_${index}`}
          />
        </InputGroup>
        {!!formikError?.key && <FormError>{formikError.key}</FormError>}
      </div>
      <div className="w-64 flex-none">
        <InputGroup
          size="small"
          className={clsx(item.needsDeletion && 'striked')}
        >
          <InputGroup.Addon>值</InputGroup.Addon>
          <InputGroup.Input
            placeholder="例如：true"
            value={item.value}
            onChange={(e) => handleChange('value', e.target.value)}
            disabled={disabled || item.isSystem}
            readOnly={readOnly}
            type="text"
            data-cy={`node-label-value-input_${index}`}
          />
        </InputGroup>
        {!!formikError?.value && <FormError>{formikError.value}</FormError>}
      </div>
      {item.isSystem && (
        <div className="flex flex-none items-center">
          <Badge type="info" className="my-auto">
            系统
          </Badge>
        </div>
      )}
    </div>
  );

  function handleChange(key: keyof NodeLabel, value: string | number) {
    onChange({ ...item, [key]: value, isChanged: true });
  }
}
