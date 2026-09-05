import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { Ingress, DeleteIngressesRequest, IngressController } from './types';

export async function getIngress(
  environmentId: EnvironmentId,
  namespace: string,
  ingressName: string
) {
  try {
    const { data: ingress } = await axios.get<Ingress[]>(
      buildUrl(environmentId, namespace, ingressName)
    );
    return ingress[0];
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取 Ingress');
  }
}

export async function getIngresses(
  environmentId: EnvironmentId,
  params?: { withServices?: boolean }
) {
  try {
    const { data: ingresses } = await axios.get<Ingress[]>(
      `kubernetes/${environmentId}/ingresses`,
      { params }
    );
    return ingresses;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取 Ingress 列表');
  }
}

export async function getIngressControllers(
  environmentId: EnvironmentId,
  namespace: string,
  allowedOnly?: boolean
) {
  try {
    const { data: ingresscontrollers } = await axios.get<IngressController[]>(
      `kubernetes/${environmentId}/namespaces/${namespace}/ingresscontrollers`,
      allowedOnly ? { params: { allowedOnly: true } } : undefined
    );
    return ingresscontrollers;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取 Ingress 控制器');
  }
}

export async function createIngress(
  environmentId: EnvironmentId,
  ingress: Ingress
) {
  try {
    return await axios.post(
      buildUrl(environmentId, ingress.Namespace),
      ingress
    );
  } catch (e) {
    throw parseAxiosError(e as Error, '无法创建 Ingress');
  }
}

export async function updateIngress(
  environmentId: EnvironmentId,
  ingress: Ingress
) {
  try {
    await axios.put(buildUrl(environmentId, ingress.Namespace), ingress);
  } catch (e) {
    throw parseAxiosError(e as Error, '无法更新 Ingress');
  }
}

export async function deleteIngresses(
  environmentId: EnvironmentId,
  data: DeleteIngressesRequest
) {
  try {
    return await axios.post(
      `kubernetes/${environmentId}/ingresses/delete`,
      data
    );
  } catch (e) {
    throw parseAxiosError(e as Error, '无法删除 Ingress');
  }
}

function buildUrl(
  environmentId: EnvironmentId,
  namespace: string,
  ingressName?: string
) {
  let url = `kubernetes/${environmentId}/namespaces/${namespace}/ingresses`;

  if (ingressName) {
    url += `/${ingressName}`;
  }

  return url;
}
