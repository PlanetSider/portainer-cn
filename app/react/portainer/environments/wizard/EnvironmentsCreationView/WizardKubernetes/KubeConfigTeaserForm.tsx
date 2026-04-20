import { Field, Form, Formik } from 'formik';
import { Plug2 } from 'lucide-react';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormControl } from '@@/form-components/FormControl';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { Input } from '@@/form-components/Input';
import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

const initialValues = {
  kubeConfig: '',
  name: '',
  meta: {
    groupId: 1,
    tagIds: [],
  },
};

export function KubeConfigTeaserForm() {
  const kubeConfigImportDocUrl = useDocsUrl(
    '/admin/environments/add/kubernetes/import'
  );

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}} validateOnMount>
      {() => (
        <Form>
          <FormSectionTitle>环境详情</FormSectionTitle>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                <span className="text-muted">
                  <a
                    href={kubeConfigImportDocUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    导入 kubeconfig 文件
                  </a>{' '}
                  到现有的本地或云平台 Kubernetes 集群中。这将在 Portainer 中创建对应环境，并在集群上安装 agent。请确保：
                </span>
              </TextTip>
            </div>
            <div className="col-sm-12 text-muted text-xs">
              <ul className="p-2 pl-4">
                <li>你的集群已启用负载均衡器</li>
                <li>你已在 kubeconfig 中指定 current-context</li>
                <li>
                  kubeconfig 是自包含的，并且包含所需的凭据。
                </li>
              </ul>
              <p>
                注意：当前官方支持的云服务商为 Civo、Akamai Connected Cloud、DigitalOcean 和 Microsoft Azure（其他平台暂不保证可用）。
              </p>
            </div>
          </div>

          <FormControl label="Name" required>
            <Field
              name="name"
              as={Input}
              data-cy="endpointCreate-nameInput"
              placeholder="e.g. docker-prod01 / kubernetes-cluster01"
              readOnly
            />
          </FormControl>

          <FormControl
            label="kubeconfig 文件"
            required
            inputId="kubeconfig_file"
          >
            <Button disabled data-cy="kubeconfig-file-upload">
              选择文件
            </Button>
          </FormControl>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                className="wizard-connect-button !ml-0"
                data-cy="kubeconfig-connect-environment-button"
                loadingText="连接环境中..."
                isLoading={false}
                disabled
                icon={Plug2}
              >
                连接
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
