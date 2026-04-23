import { Info } from 'lucide-react';
import { Field, useFormikContext } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';
import { Icon } from '@@/Icon';

import { FormValues } from '../types';

interface Props {
  isDockerStandalone: boolean;
}

export function StackRelativePathFieldset({ isDockerStandalone }: Props) {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();

  const supportRelativePath = values.git.SupportRelativePath || false;

  return (
    <div className="form-group">
      <div className="col-sm-12 mb-3">
        <SwitchField
          label="启用相对路径卷"
          checked={supportRelativePath}
          onChange={(checked) =>
            setFieldValue('git.SupportRelativePath', checked)
          }
          tooltip="启用后，你可以在 Compose 文件中指定相对路径卷，Portainer 会将 Git 仓库中的内容拉取到堆栈部署所在的环境。"
          labelClass="col-sm-3 col-lg-2"
          data-cy="enable-relative-paths"
        />
      </div>

      {supportRelativePath && (
        <>
          {!isDockerStandalone && (
            <div className="col-sm-12">
              <p className="small text-muted flex items-center gap-1">
                <Icon icon={Info} className="!mr-1 text-blue-8" />
                 在 Docker Swarm 中使用相对路径卷时，你必须提供一个所有节点都可访问的网络文件系统。
              </p>
            </div>
          )}

          <div className="col-sm-12">
            <FormControl
              label={
                isDockerStandalone
                  ? '本地文件系统路径'
                  : '网络文件系统路径'
              }
              inputId="filesystem-path"
              size="medium"
              errors={errors.git?.FilesystemPath}
            >
              <Field
                as={Input}
                id="filesystem-path"
                name="git.FilesystemPath"
                placeholder="/mnt"
                data-cy="filesystem-path"
              />
            </FormControl>
          </div>
        </>
      )}
    </div>
  );
}
