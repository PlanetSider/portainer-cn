import { CellContext } from '@tanstack/react-table';

import { ImagesListResponse } from '@/react/docker/images/queries/useImages';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip/Tooltip';

import { columnHelper } from './helper';

export const tags = columnHelper.accessor(
  (item) => (isDangling(item.tags) ? '悬空镜像' : item.tags?.join(',')),
  {
    id: 'tags',
    header: '标签',
    cell: Cell,
  }
);

function Cell({
  row: { original: item },
}: CellContext<ImagesListResponse, unknown>) {
  const repoTags = item.tags;
  const isDanglingImage = isDangling(repoTags);

  if (isDanglingImage) {
    return (
      <Badge type="muted">
        悬空镜像
        <Tooltip message="悬空镜像没有标签，且不再被任何仓库引用。" />
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {repoTags?.map((tag, idx) => (
        <Badge key={idx} type="info">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function isDangling(tags?: string[]) {
  return !tags || tags.length === 0;
}
