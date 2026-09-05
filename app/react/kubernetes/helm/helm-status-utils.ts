export enum DeploymentStatus {
  DEPLOYED = 'deployed',
  FAILED = 'failed',
  PENDING = 'pending-install',
  PENDINGUPGRADE = 'pending-upgrade',
  PENDINGROLLBACK = 'pending-rollback',
  SUPERSEDED = 'superseded',
  UNINSTALLED = 'uninstalled',
  UNINSTALLING = 'uninstalling',
}

export function getStatusColor(status?: string) {
  switch (status?.toLowerCase()) {
    case DeploymentStatus.DEPLOYED:
      return 'success';
    case DeploymentStatus.FAILED:
      return 'danger';
    case DeploymentStatus.PENDING:
    case DeploymentStatus.PENDINGUPGRADE:
    case DeploymentStatus.PENDINGROLLBACK:
    case DeploymentStatus.UNINSTALLING:
      return 'warn';
    case DeploymentStatus.SUPERSEDED:
    default:
      return 'muted';
  }
}

export function getStatusText(status?: string) {
  switch (status?.toLowerCase()) {
    case DeploymentStatus.DEPLOYED:
      return '已部署';
    case DeploymentStatus.FAILED:
      return '失败';
    case DeploymentStatus.PENDING:
      return '等待安装';
    case DeploymentStatus.PENDINGUPGRADE:
      return '等待升级';
    case DeploymentStatus.PENDINGROLLBACK:
      return '等待回滚';
    case DeploymentStatus.UNINSTALLING:
      return '卸载中';
    case DeploymentStatus.SUPERSEDED:
      return '已替代';
    default:
      return '未知';
  }
}
