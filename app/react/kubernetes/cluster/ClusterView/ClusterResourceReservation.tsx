import { Widget, WidgetBody } from '@/react/components/Widget';
import { ResourceReservation } from '@/react/kubernetes/components/ResourceReservation';

import { useClusterResourceReservationData } from './useClusterResourceReservationData';

export function ClusterResourceReservation() {
  // Load all data required for this component
  const {
    cpuLimit,
    memoryLimit,
    isLoading,
    displayResourceUsage,
    resourceUsage,
    resourceReservation,
    displayWarning,
  } = useClusterResourceReservationData();

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody>
            <ResourceReservation
              isLoading={isLoading}
              displayResourceUsage={displayResourceUsage}
              resourceReservation={resourceReservation}
              resourceUsage={resourceUsage}
              cpuLimit={cpuLimit}
              memoryLimit={memoryLimit}
              memoryUnit="MiB"
              description="资源预留量表示集群内所有应用被分配的资源总量。"
              displayWarning={displayWarning}
              warningMessage="当前无法获取资源使用情况，因为 Metrics Server 未响应。如果你最近升级过，Metrics Server 可能需要一些时间重启，请稍后再试。"
            />
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
