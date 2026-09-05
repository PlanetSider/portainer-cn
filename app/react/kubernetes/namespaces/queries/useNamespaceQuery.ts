import { useQuery } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { notifyError } from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { PortainerNamespace } from '../types';

import { queryKeys } from './queryKeys';

type QueryParams = 'withResourceQuota';

export function useNamespaceQuery<T = PortainerNamespace>(
  environmentId: EnvironmentId,
  namespace: string,
  {
    select,
    enabled,
    params,
  }: {
    select?(namespace: PortainerNamespace): T;
    params?: Record<QueryParams, string>;
    enabled?: boolean;
  } = {}
) {
  return useQuery(
    queryKeys.namespace(environmentId, namespace),
    () => getNamespace(environmentId, namespace, params),
    {
      enabled: !!environmentId && !!namespace && enabled,
      onError: (err) => {
        notifyError('失败', err as Error, '无法获取命名空间。');
      },
      select,
    }
  );
}

// getNamespace is used to retrieve a namespace using the Portainer backend
export async function getNamespace(
  environmentId: EnvironmentId,
  namespace: string,
  params?: Record<QueryParams, string>
) {
  try {
    const { data: ns } = await axios.get<PortainerNamespace>(
      `kubernetes/${environmentId}/namespaces/${namespace}`,
      {
        params,
      }
    );
    return ns;
  } catch (e) {
    throw parseAxiosError(e, '无法获取命名空间');
  }
}
