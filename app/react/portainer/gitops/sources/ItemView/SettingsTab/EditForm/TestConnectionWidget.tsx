import { ArrowLeftRight } from 'lucide-react';
import { useFormikContext } from 'formik';

import { Card } from '@@/primitives/Card';

import { Source } from '../../../types';
import { TestConnectionButton } from '../../TestConnectionButton';

import { SettingsFormValues } from './types';
import { buildUpdatePayload } from './payload';

interface Props {
  sourceId: Source['id'];
}

export function TestConnectionWidget({ sourceId }: Props) {
  const { values, initialValues } = useFormikContext<SettingsFormValues>();

  const payload = buildUpdatePayload(values, initialValues);

  return (
    <Card.Container>
      <Card.Header
        icon={ArrowLeftRight}
        title="测试连接"
        subtitle="保存前验证设置"
      />
      <Card.Body>
        <p className="mb-4 text-sm text-gray-7 th-highcontrast:text-white th-dark:text-gray-6">
          保存前测试连接，以确认设置正确。
        </p>
        <TestConnectionButton
          sourceId={sourceId}
          payload={payload}
          data-cy="source-test-connection-settings-btn"
          showError
        />
      </Card.Body>
    </Card.Container>
  );
}
