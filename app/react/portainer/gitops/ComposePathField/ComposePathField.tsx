import { useStateWrapper } from '@/react/hooks/useStateWrapper';

import { FormControl } from '@@/form-components/FormControl';
import { TextTip } from '@@/Tip/TextTip';
import { Input } from '@@/form-components/Input';

import { GitFormModel } from '../types';
import { isBE } from '../../feature-flags/feature-flags.service';

import { PathSelector } from './PathSelector';

interface Props {
  errors?: string;
  value: string;
  onChange(value: string): void;
  isCompose: boolean;
  model: GitFormModel;
  isDockerStandalone: boolean;
}

export function ComposePathField({
  value,
  onChange,
  isCompose,
  model,
  isDockerStandalone,
  errors,
}: Props) {
  const [inputValue, updateInputValue] = useStateWrapper(value, onChange);

  return (
    <div className="form-group">
      <span className="col-sm-12">
        <TextTip color="blue" className="mb-2">
          <span>
            指定以下文件相对于仓库根目录的路径：{' '}
            {isCompose ? (
              'Compose'
            ) : (
              <a
                href="https://kubernetes.io/docs/concepts/overview/working-with-objects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kubernetes manifest 文件
              </a>
            )}{' '}
            （文件扩展名必须为 yaml、yml、json 或 hcl）。
          </span>
          {isDockerStandalone && (
            <span className="ml-2">
              若要在 Docker Standalone 环境中启用对已存在镜像的重新构建，请在 Compose 文件中加入
              <code>pull_policy: build</code>，并参考{' '}
              <a href="https://docs.docker.com/compose/compose-file/#pull_policy">
                Docker 文档
              </a>
              进行配置。
            </span>
          )}
        </TextTip>
      </span>
      <div className="col-sm-12">
        <FormControl
          label={isCompose ? 'Compose 文件路径' : 'Manifest 文件路径'}
          inputId="stack_repository_path"
          required
          errors={errors}
        >
          {isBE ? (
            <PathSelector
              value={value}
              onChange={onChange}
              placeholder={isCompose ? 'docker-compose.yml' : 'manifest.yml'}
              model={model}
              inputId="stack_repository_path"
            />
          ) : (
            <Input
              value={inputValue}
              data-cy="stack-repository-path-input"
              onChange={(e) => {
                updateInputValue(e.target.value);
              }}
              placeholder={isCompose ? 'docker-compose.yml' : 'manifest.yml'}
              id="stack_repository_path"
            />
          )}
        </FormControl>
      </div>
    </div>
  );
}
