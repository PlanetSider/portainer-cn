import { useQuery } from '@tanstack/react-query';

import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';

import { workflowQueryKeys } from './query-keys';

export interface WorkflowSummary {
  healthy: number;
  error: number;
  syncing: number;
  paused: number;
  unknown: number;
}

async function getWorkflowsSummary(): Promise<WorkflowSummary> {
  const { data } = await axios.get<WorkflowSummary>(
    '/gitops/workflows/summary'
  );
  return data;
}

export function useWorkflowsSummary() {
  return useQuery({
    queryKey: workflowQueryKeys.summary(),
    queryFn: getWorkflowsSummary,
    ...withError('加载工作流摘要失败'),
  });
}
