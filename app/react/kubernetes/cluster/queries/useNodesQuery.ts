import { Node } from 'kubernetes-types/core/v1';
import { useQuery } from '@tanstack/react-query';

import axios from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { withError } from '@/react-tools/react-query';

import { parseKubernetesAxiosError } from '../../axiosError';

import { queryKeys } from './query-keys';

// getNodes is used to get a list of nodes using the kubernetes API
export async function getNodes(environmentId: EnvironmentId) {
  try {
    const { data: nodes } = await axios.get<Node[]>(
      `/kubernetes/${environmentId}/nodes`
    );
    return nodes;
  } catch (e) {
    throw parseKubernetesAxiosError(e, '无法获取节点');
  }
}

// useNodesQuery is used to get an array of nodes using the kubernetes API
export function useNodesQuery<T = Node[]>(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number; select?: (nodes: Node[]) => T }
) {
  return useQuery(
    queryKeys.nodes(environmentId),
    async () => getNodes(environmentId),
    {
      ...withError(
        '无法从 Kubernetes API 获取节点',
        '无法获取节点'
      ),
      refetchInterval: options?.autoRefreshRate ?? false,
      select: options?.select,
    }
  );
}
