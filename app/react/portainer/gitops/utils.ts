import { StackDeploymentInfo } from '@/react/common/stacks/types';

import { confirm } from '@@/modals/confirm';

import { RepoConfigResponse } from './types';

export function confirmEnableTLSVerify() {
  return confirm({
    title: '启用 TLS 验证？',
    message:
      '如果未正确配置自签名证书的证书颁发机构（CA），启用 TLS 证书验证可能导致部署失败。',
  });
}
export function isGitConfigDiverged(
  gitConfig: RepoConfigResponse,
  currentDeploymentInfo: StackDeploymentInfo | null | undefined
) {
  if (!currentDeploymentInfo) return false;

  // treat missing field as unchanged

  const urlChanged =
    typeof currentDeploymentInfo.RepositoryURL !== 'undefined' &&
    currentDeploymentInfo.RepositoryURL !== gitConfig.URL;

  const refChanged =
    typeof currentDeploymentInfo.ReferenceName !== 'undefined' &&
    currentDeploymentInfo.ReferenceName !== gitConfig.ReferenceName;

  const fileChanged =
    typeof currentDeploymentInfo.ConfigFilePath !== 'undefined' &&
    currentDeploymentInfo.ConfigFilePath !== gitConfig.ConfigFilePath;

  return urlChanged || refChanged || fileChanged;
}
