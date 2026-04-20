import _ from 'lodash';

import { columnHelper } from './helper';

export const type = columnHelper.accessor('type', {
  header: '类型',
  id: 'type',
  cell: ({ getValue }) => {
    const value = getValue();

    const map: Record<string, string> = {
      info: '信息',
      success: '成功',
      warn: '警告',
      warning: '警告',
      error: '错误',
    };

    return map[value] || _.capitalize(value);
  },
});
