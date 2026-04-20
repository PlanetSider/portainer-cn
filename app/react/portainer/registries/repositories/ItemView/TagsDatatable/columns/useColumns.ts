import { useMemo } from 'react';
import _ from 'lodash';

import { humanize } from '@/portainer/filters/filters';
import { trimSHA } from '@/docker/filters/utils';

import { buildNameColumnFromObject } from '@@/datatables/buildNameColumn';

import { Tag } from '../types';

import { helper } from './helper';
import { buildCell } from './buildCell';
import { actions } from './actions';

const columns = [
  buildNameColumnFromObject<Tag>({
    nameKey: 'Name',
    path: 'portainer.registries.registry.repository.tag',
    dataCy: 'registry-tag-name',
    idParam: 'tag',
    idGetter: (item) => item.Name,
  }),
  helper.display({
    header: '操作系统/架构',
    cell: buildCell((model) => `${model.Os}/${model.Architecture}`),
  }),
  helper.display({
    header: '镜像 ID',
    cell: buildCell((model) => trimSHA(model.ImageId)),
  }),
  helper.display({
    header: '压缩后大小',
    cell: buildCell((model) => humanize(model.Size)),
  }),
];

export function useColumns(advancedFeaturesAvailable: boolean) {
  return useMemo(
    () => _.compact([...columns, advancedFeaturesAvailable && actions]),
    [advancedFeaturesAvailable]
  );
}
