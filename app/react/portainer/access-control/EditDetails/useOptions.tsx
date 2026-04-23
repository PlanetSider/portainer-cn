import _ from 'lodash';
import { useEffect, useState } from 'react';

import { buildOption } from '@/portainer/components/BoxSelector';
import { Team } from '@/react/portainer/users/teams/types';
import { ownershipIcon } from '@/react/docker/components/datatable/createOwnershipColumn';

import { BoxSelectorOption } from '@@/BoxSelector/types';
import { BadgeIcon } from '@@/BadgeIcon';

import { ResourceControlOwnership } from '../types';

const publicOption: BoxSelectorOption<ResourceControlOwnership> = {
  value: ResourceControlOwnership.PUBLIC,
  label: '公开',
  id: 'access_public',
  description:
    '我希望任何有权访问此环境的用户都可以管理此资源',
  icon: <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.PUBLIC)} />,
};

export function useOptions(
  isAdmin: boolean,
  teams?: Team[],
  isPublicVisible = false
) {
  const [options, setOptions] = useState<
    Array<BoxSelectorOption<ResourceControlOwnership>>
  >([]);

  useEffect(() => {
    const options = isAdmin ? adminOptions() : nonAdminOptions(teams);

    setOptions(isPublicVisible ? [...options, publicOption] : options);
  }, [isAdmin, teams, isPublicVisible]);

  return options;
}

function adminOptions() {
  return [
    buildOption(
      'access_administrators',
      <BadgeIcon
        icon={ownershipIcon(ResourceControlOwnership.ADMINISTRATORS)}
      />,
      '管理员',
      '我希望仅限管理员管理此资源',
      ResourceControlOwnership.ADMINISTRATORS
    ),
    buildOption(
      'access_restricted',
      <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.RESTRICTED)} />,
      '受限',
      '我希望仅允许指定用户和/或团队管理此资源',
      ResourceControlOwnership.RESTRICTED
    ),
  ];
}
function nonAdminOptions(teams?: Team[]) {
  return _.compact([
    buildOption(
      'access_private',
      <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.PRIVATE)} />,
      '私有',
      '我希望此资源仅由我自己管理',
      ResourceControlOwnership.PRIVATE
    ),
    teams &&
      teams.length > 0 &&
      buildOption(
        'access_restricted',
        <BadgeIcon icon={ownershipIcon(ResourceControlOwnership.RESTRICTED)} />,
        '受限',
        teams.length === 1 ? (
          <>
            我希望我的团队（<b>{teams[0].Name}</b>）中的任意成员都可以管理此资源
          </>
        ) : (
          <>
            我希望仅允许我的一个或多个团队管理此资源
          </>
        ),
        ResourceControlOwnership.RESTRICTED
      ),
  ]);
}
