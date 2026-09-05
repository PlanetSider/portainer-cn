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
      <Alert color="info" title="正在测试连接..." className="mt-4">
        正在检查 Portainer 是否可以访问该仓库。
      </Alert>
    );
  }

  if (query.isError) {
    return (
      <Alert color="error" title="连接失败" className="mt-4">
        无法测试连接，请重试。
      </Alert>
    );
  }

  if (query.data?.success) {
    return (
      <Alert color="success" title="连接成功" className="mt-4">
        Portainer 已使用这些配置连接到该仓库。
      </Alert>
    );
  }

  return (
    <Alert color="error" title="连接失败" className="mt-4">
      {query.data?.error || '无法访问该仓库。'}
    </Alert>
  );
}
