import { Field, useFormikContext } from 'formik';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

import { useGetMetricsMutation } from '@/react/kubernetes/queries/useGetMetricsMutation';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Switch } from '@@/form-components/SwitchField/Switch';
import { InlineLoader } from '@@/InlineLoader';

import { ConfigureFormValues } from './types';

type Props = {
  environmentId: number;
  value: boolean;
  error?: string;
};

export function EnableMetricsInput({ value, error, environmentId }: Props) {
  const { setFieldValue } = useFormikContext<ConfigureFormValues>();
  const [metricsFound, setMetricsFound] = useState<boolean>();
  const getMetricsMutation = useGetMetricsMutation();
  return (
    <div className="mb-4">
      <TextTip color="blue">
        <p>
          启用指标功能后，用户可以使用 Pod 水平自动扩缩容，并查看容器和节点的资源使用情况。
          这需要在集群中运行{' '}
          <a
            href="https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server"
            target="_blank"
            rel="noreferrer"
          >
            metrics server
          </a>{' '}
          或{' '}
          <a
            href="https://github.com/kubernetes-sigs/prometheus-adapter"
            target="_blank"
            rel="noreferrer"
          >
            prometheus
          </a>{' '}
          。
        </p>
        <p>
          之后如果关闭该功能，已部署且启用自动扩缩容的应用仍会继续自动扩缩容
          （你需要移除它们的 autoscaler 定义后才会停止）。
        </p>
      </TextTip>
      <FormControl
        label="启用基于 Metrics API 的功能"
        className="mb-0"
        size="large"
        errors={error}
        inputId="kubeSetup-metricsToggle"
      >
        <Field
          name="useServerMetrics"
          as={Switch}
          checked={value}
          id="kubeSetup-metricsToggle"
          onChange={(checked: boolean) => {
            // if turning off, just set the value
            if (!checked) {
              setFieldValue('useServerMetrics', checked);
              return;
            }
            // if turning on, see if the metrics server is available, then set the value to on if it is
            getMetricsMutation.mutate(environmentId, {
              onSuccess: () => {
                setMetricsFound(true);
                setFieldValue('useServerMetrics', checked);
              },
              onError: () => {
                setMetricsFound(false);
              },
            });
          }}
          data-cy="kubeSetup-metricsToggle"
        />
      </FormControl>
      {getMetricsMutation.isLoading && (
        <InlineLoader size="sm">正在检查 Metrics API...</InlineLoader>
      )}
      {!getMetricsMutation.isLoading && (
        <>
          {metricsFound === false && (
            <TextTip color="red" icon={XCircle}>
              无法访问 Metrics API，请确认 metrics server 已正确部署到该集群中。
            </TextTip>
          )}
          {metricsFound === true && (
            <TextTip color="green" icon={CheckCircle}>
              已成功连接到 Metrics API
            </TextTip>
          )}
        </>
      )}
    </div>
  );
}
