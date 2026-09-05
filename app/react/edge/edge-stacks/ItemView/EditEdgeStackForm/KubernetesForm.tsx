import { useFormikContext } from 'formik';

import { SwitchField } from '@@/form-components/SwitchField';
import { WebEditorForm } from '@@/WebEditorForm';

import { DeploymentType } from '../../types';

import { FormValues } from './types';

export function KubernetesForm({
  handleContentChange,
  handleVersionChange,
  versionOptions,
}: {
  handleContentChange: (type: DeploymentType, content: string) => void;
  handleVersionChange: (version: number) => void;
  versionOptions: number[] | undefined;
}) {
  const { errors, values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="使用清单中指定的命名空间"
            data-cy="use-manifest-namespaces-switch"
            tooltip="如果部署文件中定义了命名空间，启用后部署时将仅使用这些命名空间。"
            checked={values.useManifestNamespaces}
            onChange={(value) => setFieldValue('useManifestNamespaces', value)}
          />
        </div>
      </div>

      <WebEditorForm
        data-cy="kube-manifest-editor"
        value={values.content}
        type="yaml"
        id="kube-manifest-editor"
        textTip="在此定义或粘贴清单内容"
        onChange={(value) =>
          handleContentChange(DeploymentType.Kubernetes, value)
        }
        error={errors.content}
        versions={versionOptions}
        onVersionChange={handleVersionChange}
      >
        <p>
          有关 Kubernetes 文件格式的更多信息，请参阅{' '}
          <a
            href="https://kubernetes.io/docs/concepts/overview/working-with-objects/"
            target="_blank"
            rel="noreferrer"
          >
            官方文档
          </a>
          .
        </p>
      </WebEditorForm>
    </>
  );
}
