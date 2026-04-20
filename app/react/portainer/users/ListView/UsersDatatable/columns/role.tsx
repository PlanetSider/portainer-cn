import { User, UserPlus } from 'lucide-react';

import { isEdgeAdmin } from '@/portainer/users/user.helpers';
import { RoleNames } from '@/portainer/users/types';

import { Icon } from '@@/Icon';

import { helper } from './helper';

export const role = helper.accessor(
    (item) =>
      `${
        {
          administrator: '管理员',
          user: '用户',
          'edge administrator': '边缘管理员',
        }[RoleNames[item.Role]] || RoleNames[item.Role]
      } ${item.isTeamLeader ? ' - 团队负责人' : ''}`.trim(),
  {
    header: '角色',
    cell: ({ getValue, row: { original: item } }) => {
      const icon =
        isEdgeAdmin({ Role: item.Role }) || item.isTeamLeader ? User : UserPlus;

      return (
        <span className="vertical-center">
          <Icon icon={icon} />
          {getValue() || '-'}
        </span>
      );
    },
  }
);
