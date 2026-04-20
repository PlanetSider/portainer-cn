import { RoleViewModel, RoleTypes } from '../models/role';

export function RoleService() {
  const rolesData = [
    new RoleViewModel(RoleTypes.ENDPOINT_ADMIN, '环境管理员', '对环境中的所有资源拥有完全控制权', []),
    new RoleViewModel(RoleTypes.OPERATOR, '运维人员', '对环境中的所有现有资源拥有操作控制权限', []),
    new RoleViewModel(RoleTypes.HELPDESK, '支持人员', '对环境中的所有资源拥有只读访问权限', []),
    new RoleViewModel(RoleTypes.READ_ONLY, '只读用户', '对环境中已分配资源拥有只读访问权限', []),
    new RoleViewModel(RoleTypes.STANDARD, '标准用户', '对环境中已分配资源拥有完全控制权', []),
  ];

  return {
    roles,
  };

  function roles() {
    return rolesData;
  }
}
