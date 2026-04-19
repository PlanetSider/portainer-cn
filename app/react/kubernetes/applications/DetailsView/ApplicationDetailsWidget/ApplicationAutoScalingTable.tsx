import { Move } from 'lucide-react';

import { EnvironmentId } from '@/react/portainer/environments/types';

import { Icon } from '@@/Icon';
import { TextTip } from '@@/Tip/TextTip';
import { Tooltip } from '@@/Tip/Tooltip';

import { Application } from '../../types';
import { useApplicationHorizontalPodAutoscaler } from '../../queries/useApplicationHorizontalPodAutoscaler';

type Props = {
  environmentId: EnvironmentId;
  namespace: string;
  appName: string;
  app?: Application;
};

export function ApplicationAutoScalingTable({
  environmentId,
  namespace,
  appName,
  app,
}: Props) {
  const { data: appAutoScalar } = useApplicationHorizontalPodAutoscaler(
    environmentId,
    namespace,
    appName,
    app
  );

  return (
    <>
      <div className="text-muted mb-4 flex items-center">
        <Icon icon={Move} className="!mr-2" />
        自动扩缩容
      </div>
      {!appAutoScalar && (
        <TextTip color="blue">
          此应用未定义自动扩缩容策略。
        </TextTip>
      )}
      {appAutoScalar && (
        <div className="mt-4 w-3/5">
          <table className="table">
            <tbody>
              <tr className="text-muted">
                <td className="w-1/3">最小实例数</td>
                <td className="w-1/3">最大实例数</td>
                <td className="w-1/3">
                  <div className="flex min-w-max items-center gap-1">
                    目标 CPU 使用率
                    <Tooltip message="自动扩缩容器会确保有足够的实例运行，以维持所有实例的平均 CPU 使用率。" />
                  </div>
                </td>
              </tr>
              <tr>
                <td data-cy="k8sAppDetail-minReplicas">
                  {appAutoScalar.spec?.minReplicas}
                </td>
                <td data-cy="k8sAppDetail-maxReplicas">
                  {appAutoScalar.spec?.maxReplicas}
                </td>
                <td data-cy="k8sAppDetail-targetCPU">
                  {appAutoScalar.spec?.targetCPUUtilizationPercentage}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
