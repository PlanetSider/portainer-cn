import { Alert } from '@@/Alert';
import { SwitchField } from '@@/form-components/SwitchField';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';

import { DrainOptions as DrainOptionsValues } from './types';

interface Props {
  values: DrainOptionsValues;
  onChange: (values: DrainOptionsValues) => void;
  hasNodeWriteAccess: boolean;
}

export function DrainOptions({ values, onChange, hasNodeWriteAccess }: Props) {
  return (
    <>
      <FormSectionTitle titleSize="sm">排空选项</FormSectionTitle>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="忽略 DaemonSet"
            labelClass="col-sm-5 col-lg-4"
            tooltip="忽略由 DaemonSet 管理的 Pod。这些 Pod 会由其控制器重新创建，否则会阻止排空操作。"
            checked={values.ignoreDaemonSets}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) =>
              onChange({ ...values, ignoreDaemonSets: checked })
            }
            data-cy="node-drain-ignore-daemonsets"
          />
        </div>
      </div>
      <FormControl label="超时时间（秒）" size="large">
        <Input
          type="number"
          min="0"
          className="max-w-[8rem]"
          value={values.timeoutSeconds}
          disabled={!hasNodeWriteAccess}
          onChange={(e) =>
            onChange({ ...values, timeoutSeconds: Number(e.target.value) })
          }
          data-cy="node-drain-timeout-input"
        />
      </FormControl>
      <FormControl label="优雅终止期限（秒）" size="large">
        <Input
          type="number"
          min="-1"
          className="max-w-[8rem]"
          value={values.gracePeriodSeconds}
          disabled={!hasNodeWriteAccess}
          onChange={(e) =>
            onChange({
              ...values,
              gracePeriodSeconds: Number(e.target.value),
            })
          }
          data-cy="node-drain-grace-period-input"
        />
      </FormControl>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="强制执行"
            labelClass="col-sm-5 col-lg-4"
            tooltip="即使存在不受 ReplicationController、ReplicaSet、Job、DaemonSet 或 StatefulSet 管理的 Pod，仍继续执行。被删除的 Pod 不会重新创建。"
            checked={values.force}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) => onChange({ ...values, force: checked })}
            data-cy="node-drain-force"
          />
        </div>
      </div>
      {values.force && (
        <div className="form-group">
          <div className="col-sm-12">
            <Alert color="warn">
              强制排空会删除不受控制器管理的独立 Pod，这些 Pod 不会重新创建。
            </Alert>
          </div>
        </div>
      )}
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="删除 emptyDir 数据"
            labelClass="col-sm-5 col-lg-4"
            tooltip="即使存在使用 emptyDir 卷的 Pod，仍继续执行。"
            checked={values.deleteEmptyDirData}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) =>
              onChange({ ...values, deleteEmptyDirData: checked })
            }
            data-cy="node-drain-delete-emptydir"
          />
        </div>
      </div>
      {values.deleteEmptyDirData && (
        <div className="form-group">
          <div className="col-sm-12">
            <Alert color="warn">
              排空节点时将删除这些卷中的数据。
            </Alert>
          </div>
        </div>
      )}
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="禁用驱逐"
            labelClass="col-sm-5 col-lg-4"
            tooltip="强制排空时使用删除而非驱逐，这会绕过 PodDisruptionBudget 检查。"
            checked={values.disableEviction}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) =>
              onChange({ ...values, disableEviction: checked })
            }
            data-cy="node-drain-disable-eviction"
          />
        </div>
      </div>
      {values.disableEviction && (
        <div className="form-group">
          <div className="col-sm-12">
            <Alert color="warn">
              Pod 将被直接删除，忽略原本用于保护应用可用性的 PodDisruptionBudget。
            </Alert>
          </div>
        </div>
      )}
    </>
  );
}
