import { ComponentProps } from 'react';

import { Alert } from '@@/Alert';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

import { EnvironmentVariablesFieldset } from './EnvironmentVariablesFieldset';
import { EnvironmentVariablesPanel } from './EnvironmentVariablesPanel';

type FieldsetProps = ComponentProps<typeof EnvironmentVariablesFieldset>;

export function StackEnvironmentVariablesPanel({
  onChange,
  values,
  errors,
  isFoldable = false,
  showHelpMessage,
}: {
  isFoldable?: boolean;
  showHelpMessage?: boolean;
} & FieldsetProps) {
  return (
    <EnvironmentVariablesPanel
      explanation={
        <div>
          你可以在{' '}
          <a
            href={`${useDocsUrl(
              '/user/docker/stacks/add#environment-variables'
            )}`}
            target="_blank"
            data-cy="stack-env-vars-help-link"
            rel="noreferrer noopener"
          >
            Compose 文件中使用环境变量
          </a>
          。下方设置的环境变量值将作为 Compose 文件中的变量替换项。注意，你也可以在 Compose 文件中引用 stack.env 文件。stack.env 文件中保存环境变量及其对应值（例如：TAG=v1.5）。
        </div>
      }
      onChange={onChange}
      values={values}
      errors={errors}
      isFoldable={isFoldable}
      showHelpMessage={showHelpMessage}
      alertMessage={
        <div className="flex p-4">
          <Alert color="info" className="col-sm-12">
            <div>
              <p>
                <strong>stack.env 文件说明</strong>
              </p>
              <div>
                通过 <strong>Repository</strong> 部署时，stack.env 文件必须已存在于 Git 仓库中。
              </div>
              <div>
                通过 <strong>Web editor</strong>、<strong>Upload</strong> 或 <strong>自定义模板部署</strong> 时，stack.env 文件会根据你在下方设置的内容自动生成。
              </div>
            </div>
          </Alert>
        </div>
      }
    />
  );
}
