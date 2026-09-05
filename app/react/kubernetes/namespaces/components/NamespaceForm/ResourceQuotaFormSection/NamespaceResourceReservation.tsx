import { ResourceReservation } from '@/react/kubernetes/components/ResourceReservation';

import { ResourceQuotaFormValues } from './types';
import { useNamespaceResourceReservationData } from './useNamespaceResourceReservationData';

interface Props {
  namespaceName: string;
  environmentId: number;
  resourceQuotaValues: ResourceQuotaFormValues;
}

export function NamespaceResourceReservation({
  environmentId,
  namespaceName,
  resourceQuotaValues,
}: Props) {
  const {
    cpuLimit,
    memoryLimit,
    displayResourceUsage,
    resourceUsage,
    resourceReservation,
    isLoading,
  } = useNamespaceResourceReservationData(
    environmentId,
    namespaceName,
    resourceQuotaValues
  );

  if (!resourceQuotaValues.enabled) {
    return null;
  }

  return (
    <ResourceReservation
      displayResourceUsage={displayResourceUsage}
      resourceReservation={resourceReservation}
      resourceUsage={resourceUsage}
      cpuLimit={cpuLimit}
      memoryLimit={memoryLimit}
      description="资源预留表示分配给此命名空间中所有已部署应用程序的资源总量。"
      isLoading={isLoading}
    />
  );
}
