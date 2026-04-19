import { useState } from 'react';
import { FormikErrors } from 'formik';

import {
  PathSelector,
  PathSelectorGitModel,
} from '@/react/portainer/gitops/ComposePathField/PathSelector';
import { dummyGitForm } from '@/react/portainer/gitops/RelativePathFieldset/utils';

import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Input, Select } from '@@/form-components/Input';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';
import { InsightsBox } from '@@/InsightsBox';

import { RelativePathModel, getPerDevConfigsFilterType } from './types';

interface Props {
  values: RelativePathModel;
  gitModel?: PathSelectorGitModel;
  onChange: (value: RelativePathModel) => void;
  isEditing?: boolean;
  hideEdgeConfigs?: boolean;
  errors?: FormikErrors<RelativePathModel>;
}

export function RelativePathFieldset({
  values: value,
  gitModel,
  onChange = () => {},
  isEditing,
  hideEdgeConfigs,
  errors,
}: Props) {
  const [relativePathManuallyEnabled, setRelativePathManuallyEnabled] =
    useState(value.SupportRelativePath);

  const [relativePathForcedEnabled, setRelativePathForcedEnabled] = useState(
    value.SupportPerDeviceConfigs
  );

  const gitoptsEdgeConfigDocUrl = useDocsUrl(
    '/user/edge/stacks/add#gitops-edge-configurations'
  );

  const pathTipSwarm =
    '在 Docker Swarm 中使用相对路径卷时，你必须具备一个所有节点都可访问的网络文件系统。';
  const pathTipGitopsActive =
    'GitOps Edge 配置已启用。当你设置“本地文件系统路径”时，它也将用于相对路径。';

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="EnableRelativePaths"
            data-cy="gitops-enable-relative-paths-switch"
            label="启用相对路径卷"
            labelClass="col-sm-3 col-lg-2"
            tooltip="启用后，你可以在 Compose 文件中指定相对路径卷，Portainer 会将内容从 Git 仓库拉取到堆栈部署所在环境。"
            disabled={isEditing || relativePathForcedEnabled}
            checked={value.SupportRelativePath}
            onChange={(value) => {
              setRelativePathManuallyEnabled(value);
              handleChange({ SupportRelativePath: value });
            }}
          />
        </div>
      </div>

      {value.SupportRelativePath && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                {relativePathForcedEnabled ? pathTipGitopsActive : pathTipSwarm}
              </TextTip>
            </div>
          </div>

          {(!relativePathForcedEnabled || hideEdgeConfigs) && (
            <div className="form-group">
              <div className="col-sm-12">
                <FormControl
                  label="本地文件系统路径"
                  errors={errors?.FilesystemPath}
                  required
                >
                  <Input
                    name="FilesystemPath"
                    data-cy="relative-path-filesystem-path-input"
                    placeholder="/mnt"
                    disabled={isEditing}
                    value={value.FilesystemPath}
                    onChange={(e) =>
                      handleChange({ FilesystemPath: e.target.value })
                    }
                  />
                </FormControl>
              </div>
            </div>
          )}
        </>
      )}

      {!hideEdgeConfigs && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                 启用后，对应的 Edge ID 将通过环境变量 PORTAINER_EDGE_ID 传递。
              </TextTip>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="EnablePerDeviceConfigs"
                data-cy="gitops-enable-per-device-configs-switch"
                label="GitOps Edge 配置"
                labelClass="col-sm-3 col-lg-2"
                tooltip="启用 GitOps Edge 配置功能后，你可以在配置文件中定义相对路径卷。Portainer 会通过将文件夹名或文件名与 Portainer Edge ID 匹配，从 Git 仓库自动获取内容，并应用到堆栈部署所在环境。"
                disabled={isEditing}
                checked={!!value.SupportPerDeviceConfigs}
                onChange={(v) => {
                  setRelativePathForcedEnabled(v);
                  handleChange({
                    SupportPerDeviceConfigs: v,
                    SupportRelativePath: v ? true : relativePathManuallyEnabled,
                  });
                }}
              />
            </div>
          </div>

          {value.SupportPerDeviceConfigs && (
            <>
              <InsightsBox
                content={
                  <p>
                    Files named <code>$&#123;PORTAINER_EDGE_ID&#125;.env</code>{' '}
                    and/or <code>$&#123;PORTAINER_EDGE_GROUP&#125;.env</code>{' '}
                    contained by the config folder will be loaded for compose
                    file interpolation.
                  </p>
                }
                header="GitOps Edge 配置"
                insightCloseId="edge-config-interpolation-info"
                className="mb-3"
              />

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">{pathTipSwarm}</TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl
                    label="Local filesystem path"
                    errors={errors?.FilesystemPath}
                    required
                  >
                    <Input
                      name="FilesystemPath"
                      data-cy="per-device-configs-filesystem-path-input"
                      placeholder="/mnt"
                      disabled={isEditing}
                      value={value.FilesystemPath}
                      onChange={(e) =>
                        handleChange({ FilesystemPath: e.target.value })
                      }
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    指定配置所在的目录名称。这样你就可以将 Git 仓库作为模板来管理设备配置。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl
                    label="目录"
                    errors={errors?.PerDeviceConfigsPath}
                    inputId="per_device_configs_path_input"
                    required
                  >
                    <PathSelector
                      value={value.PerDeviceConfigsPath || ''}
                      onChange={(value) =>
                        handleChange({ PerDeviceConfigsPath: value })
                      }
                      placeholder="config"
                      model={gitModel || dummyGitForm}
                      readOnly={isEditing}
                      dirOnly
                      inputId="per_device_configs_path_input"
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    选择用于将配置与 Portainer Edge ID 匹配的规则，可按设备匹配，也可通过 Edge Group 按组匹配。只有符合所选规则的配置才能通过对应路径访问，否则依赖这些配置的部署可能会出错。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="设备匹配规则">
                    <Select
                      value={value.PerDeviceConfigsMatchType}
                      data-cy="per-device-configs-match-type-select"
                      onChange={(e) =>
                        handleChange({
                          PerDeviceConfigsMatchType: getPerDevConfigsFilterType(
                            e.target.value
                          ),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '将文件名与 Portainer Edge ID 匹配',
                          value: 'file',
                        },
                        {
                          label: '将文件夹名与 Portainer Edge ID 匹配',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="组匹配规则">
                    <Select
                      value={value.PerDeviceConfigsGroupMatchType}
                      data-cy="per-device-configs-group-match-type-select"
                      onChange={(e) =>
                        handleChange({
                          PerDeviceConfigsGroupMatchType:
                            getPerDevConfigsFilterType(e.target.value),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '将文件名与 Edge Group 匹配',
                          value: 'file',
                        },
                        {
                          label: '将文件夹名与 Edge Group 匹配',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    <div>
                        你可以将其作为环境变量用于镜像：{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_ID&#125;</code> or{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_GROUP&#125;</code>. You
                      can also use it with the relative path for volumes:{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_ID&#125;:/myapp/config
                      </code>{' '}
                      or{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_GROUP&#125;:/myapp/groupconfig
                      </code>
                      。更多文档可参见{' '}
                      <a href={gitoptsEdgeConfigDocUrl}>here</a>.
                    </div>
                  </TextTip>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );

  function handleChange(newValue: Partial<RelativePathModel>) {
    onChange({ ...value, ...newValue });
  }
}
