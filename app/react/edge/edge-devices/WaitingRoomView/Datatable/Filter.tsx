import { HomepageFilter } from '@/react/portainer/HomeView/EnvironmentList/HomepageFilter';
import { useGroups } from '@/react/portainer/environments/environment-groups/queries';
import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';
import { useTags } from '@/portainer/tags/queries';

import { PortainerSelect } from '@@/form-components/PortainerSelect';

import { useFilterStore } from './filter-store';

const checkInOptions = [
  { value: 0, label: '显示全部时间' },
  { value: 60 * 60, label: '显示过去 1 小时' },
  { value: 60 * 60 * 24, label: '显示过去 1 天' },
  { value: 60 * 60 * 24 * 7, label: '显示过去 1 周' },
  { value: 60 * 60 * 24 * 14, label: '显示过去 14 天' },
];

export function Filter() {
  const edgeGroupsQuery = useEdgeGroups();
  const groupsQuery = useGroups();
  const tagsQuery = useTags();

  const filterStore = useFilterStore();

  if (!edgeGroupsQuery.data || !groupsQuery.data || !tagsQuery.data) {
    return null;
  }

  return (
    <div className="flex w-full gap-5 [&>*]:w-1/5">
      <HomepageFilter
        onChange={(f) => filterStore.setEdgeGroups(f)}
        placeHolder="边缘组"
        value={filterStore.edgeGroups}
        filterOptions={edgeGroupsQuery.data.map((g) => ({
          label: g.Name,
          value: g.Id,
        }))}
      />
      <HomepageFilter
        onChange={(f) => filterStore.setGroups(f)}
        placeHolder="分组"
        value={filterStore.groups}
        filterOptions={groupsQuery.data.map((g) => ({
          label: g.Name,
          value: g.Id,
        }))}
      />
      <HomepageFilter
        onChange={(f) => filterStore.setTags(f)}
        placeHolder="标签"
        value={filterStore.tags}
        filterOptions={tagsQuery.data.map((g) => ({
          label: g.Name,
          value: g.ID,
        }))}
      />

      <div className="ml-auto" />
      <PortainerSelect
        onChange={(f) => filterStore.setCheckIn(f || 0)}
        value={filterStore.checkIn}
        options={checkInOptions}
        bindToBody
        data-cy="edge-devices-check-in-filter"
      />
    </div>
  );
}
