import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';

import { useDebouncedValue } from '@/react/hooks/useDebouncedValue';

import { Alert } from '@@/Alert';

import { FormValues, gitFormValuesToTestPayload } from '../type';
import { useTestSourceConnection } from '../useTestSourceConnection';
import { validateGitConnection } from '../validation';

export function ConnectionTest() {
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const { git } = values;

  const livePayload = validateGitConnection().isValidSync(git)
    ? gitFormValuesToTestPayload(git)
    : undefined;

  const debouncedPayload = useDebouncedValue(livePayload);
  const query = useTestSourceConnection(debouncedPayload);

  const settled = isEqual(debouncedPayload, livePayload) && !query.isFetching;
  const connectionOk = settled && query.data?.success === true;

  useEffect(() => {
    setFieldValue('git.connectionOk', connectionOk);
  }, [connectionOk, setFieldValue]);

  if (!livePayload) {
    return null;
  }

  if (!settled) {
    return (
      <Alert color="info" title="正在测试连接...">
        正在检查 Portainer 能否访问该 Repository。
      </Alert>
    );
  }

  if (query.isError) {
    return (
      <Alert color="error" title="连接失败">
        无法测试连接，请重试。
      </Alert>
    );
  }

  if (query.data?.success) {
    return (
      <Alert color="success" title="连接成功">
        Portainer 已使用这些连接信息成功访问 Repository。
      </Alert>
    );
  }

  return (
    <Alert color="error" title="连接失败">
      {query.data?.error || '无法访问 Repository。'}
    </Alert>
  );
}
