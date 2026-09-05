import { SetStateAction } from 'react';
import { FormikErrors } from 'formik';

import { GitForm } from '@/react/portainer/gitops/GitForm';
import { GitFormModel } from '@/react/portainer/gitops/types';
import { baseEdgeStackWebhookUrl } from '@/portainer/helpers/webhookHelper';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { BoxSelector } from '@@/BoxSelector';
import { WebEditorForm } from '@@/WebEditorForm';
import { FileUploadForm } from '@@/form-components/FileUpload';
import { SwitchField } from '@@/form-components/SwitchField';
import { FormSection } from '@@/form-components/FormSection';
import {
  editor,
  git,
  upload,
} from '@@/BoxSelector/common-options/build-methods';

const buildMethods = [editor, upload, git] as const;

export interface KubeFormValues {
  method: 'editor' | 'upload' | 'repository' | 'template';
  useManifestNamespaces: boolean;
  fileContent: string;
  file?: File;
  git: GitFormModel;
}

export function KubeManifestForm({
  errors,
  values,
  setValues,
  webhookId,
}: {
  errors?: FormikErrors<KubeFormValues>;
  values: KubeFormValues;
  setValues: (values: SetStateAction<KubeFormValues>) => void;
  webhookId: string;
}) {
  const { method } = values;

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="使用清单中指定的命名空间"
            tooltip="如果你已在部署文件中定义命名空间，启用后部署时将只使用这些命名空间。"
            checked={values.useManifestNamespaces}
            onChange={(value) =>
              handleChange({
                useManifestNamespaces: value,
              })
            }
            data-cy="use-manifest-namespaces-switch"
          />
        </div>
      </div>

      <FormSection title="构建方式">
        <BoxSelector
          options={buildMethods}
          onChange={(value) => handleChange({ method: value })}
          value={method}
          radioName="method"
          slim
        />
      </FormSection>

      {method === editor.value && (
        <WebEditorForm
          id="stack-creation-editor"
          value={values.fileContent}
          onChange={(value) => handleChange({ fileContent: value })}
          type="yaml"
          textTip="请在此定义或粘贴清单文件内容"
          error={errors?.fileContent}
          data-cy="stack-creation-editor"
        >
          <KubeDeployDescription />
        </WebEditorForm>
      )}

      {method === upload.value && (
        <FileUploadForm
          value={values.file}
          onChange={(file) => handleChange({ file })}
          required
          description="你可以从本地电脑上传 Manifest 文件。"
          data-cy="stack-creation-file-upload"
        >
          <KubeDeployDescription />
        </FileUploadForm>
      )}

      {method === git.value && (
        <GitForm
          deployMethod="manifest"
          errors={errors?.git}
          value={values.git}
          onChange={(gitValues) =>
            setValues((values) => ({
              ...values,
              git: {
                ...values.git,
                ...gitValues,
              },
            }))
          }
          baseWebhookUrl={baseEdgeStackWebhookUrl()}
          webhookId={webhookId}
          isAutoUpdateVisible={isBE}
        />
      )}
    </>
  );

  function handleChange(newValues: Partial<KubeFormValues>) {
    setValues((values) => ({
      ...values,
      ...newValues,
    }));
  }
}

function KubeDeployDescription() {
  return (
    <>
      <div>
        模板允许部署任意类型的 Kubernetes 资源（Deployment、Secret、ConfigMap 等）。
      </div>
      <div>
        你可以在
        <a
          href="https://kubernetes.io/docs/concepts/overview/working-with-objects/"
          target="_blank"
          rel="noreferrer"
        >
          官方文档
        </a>
        中了解更多 Kubernetes 文件格式信息。
      </div>
    </>
  );
}
