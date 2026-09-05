import { array, string, boolean, number, object } from 'yup';

import { buildUniquenessTest } from '@@/form-components/validate-unique';

// https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set
// Labels are key/value pairs. Valid label keys have two segments: an optional prefix and name, separated by a slash (/). The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between. The prefix is optional. If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (.), not longer than 253 characters in total, followed by a slash (/).
// Valid label value:
// must be 63 characters or less (can be empty),
// unless empty, must begin and end with an alphanumeric character ([a-z0-9A-Z]),
// could contain dashes (-), underscores (_), dots (.), and alphanumerics between.
const labelKeyValidation = string()
  .required('标签键为必填项')
  .test(
    'prefix-test',
    '标签键前缀必须是有效的 DNS 子域名',
    (value) => {
      if (!value) return true; // handled by required()

      const parts = value.split('/');
      if (parts.length === 1) return true; // no prefix is valid
      if (parts.length > 2) return false; // only one slash allowed

      const [prefix] = parts;

      // Prefix validation: DNS subdomain rules
      if (prefix.length > 253) return false;
      if (prefix === '') return false; // empty prefix not allowed if slash present

      // DNS subdomain: series of DNS labels separated by dots
      const labels = prefix.split('.');
      return labels.every((label) => {
        // Each DNS label must be 1-63 chars, start/end with alphanumeric, contain only alphanumeric and hyphens
        if (label.length === 0 || label.length > 63) return false;
        if (!/^[a-zA-Z0-9]/.test(label) || !/[a-zA-Z0-9]$/.test(label))
          return false;
        if (!/^[a-zA-Z0-9-]+$/.test(label)) return false;
        return true;
      });
    }
  )
  .test(
    'name-test',
    '标签键必须以字母或数字开头和结尾，且只能包含字母、数字、连字符、下划线和点',
    (value) => {
      if (!value) return true; // handled by required()

      const parts = value.split('/');
      const name = parts[parts.length - 1]; // name is always the last part

      // Name validation
      if (name.length === 0 || name.length > 63) return false;
      if (!/^[a-zA-Z0-9]/.test(name) || !/[a-zA-Z0-9]$/.test(name))
        return false;
      if (!/^[a-zA-Z0-9._-]+$/.test(name)) return false;

      return true;
    }
  );

const labelValueValidation = string()
  .max(63, '标签值不能超过 63 个字符')
  .test(
    'value-format',
    '标签值必须以字母或数字开头和结尾，且只能包含字母、数字、连字符、下划线和点',
    (value) => {
      if (!value || value === '') return true; // empty values are allowed

      // Must start and end with alphanumeric
      if (!/^[a-zA-Z0-9]/.test(value) || !/[a-zA-Z0-9]$/.test(value))
        return false;

      // Can only contain alphanumeric, hyphens, underscores, and dots
      if (!/^[a-zA-Z0-9._-]+$/.test(value)) return false;

      return true;
    }
  );

const labelSchema = object({
  key: labelKeyValidation,
  value: labelValueValidation,
  needsDeletion: boolean().default(false),
  isNew: boolean().default(false),
  isUsed: boolean().default(false),
  isChanged: boolean().default(false),
});

const taintSchema = object({
  key: string().required('污点键为必填项'),
  value: string(),
  effect: string()
    .oneOf(['NoSchedule', 'PreferNoSchedule', 'NoExecute'])
    .required('效果为必填项'),
  needsDeletion: boolean().default(false),
  isNew: boolean().default(false),
  isChanged: boolean().default(false),
});

const drainOptionsSchema = object({
  ignoreDaemonSets: boolean().default(true),
  timeoutSeconds: number()
    .min(0, '超时时间必须为零或正数秒')
    .required('超时时间为必填项'),
  gracePeriodSeconds: number()
    .min(-1, '宽限期必须为 -1 或正数秒')
    .required('宽限期为必填项'),
  force: boolean().default(false),
  deleteEmptyDirData: boolean().default(true),
  disableEviction: boolean().default(false),
});

export function createValidationSchema(
  isOnlyNode: boolean,
  hasDrainOperation: boolean,
  containsPortainer: boolean
) {
  return object({
    availability: string()
      .oneOf(['Active', 'Pause', 'Drain'])
      .test(
        'only-node-drain',
        '无法排空集群中的唯一节点',
        (value) => {
          if (value === 'Drain' && isOnlyNode) {
            return false;
          }
          return true;
        }
      )
      .test(
        'other-node-drain',
        '其他节点正在排空时，无法排空此节点',
        (value) => {
          if (value === 'Drain' && hasDrainOperation) {
            return false;
          }
          return true;
        }
      )
      .test(
        'portainer-drain',
        '无法排空运行 Portainer 实例的节点',
        (value) => {
          if (value === 'Drain' && containsPortainer) {
            return false;
          }
          return true;
        }
      )
      .required('可用性为必填项'),
    labels: array(labelSchema).test(
      'unique-label-keys',
      '不允许使用重复的标签键',
      buildUniquenessTest(() => '此标签键已定义', 'key')
    ),
    taints: array(taintSchema).test(
      'unique-taint-keys',
      '不允许使用重复的污点键',
      buildUniquenessTest(() => '此污点键已定义', 'key')
    ),
    drainOptions: drainOptionsSchema,
  });
}
