import { Form, useFormikContext } from 'formik';

import { ImageConfigFieldset } from '@@/ImageConfigFieldset';
import { FormSection } from '@@/form-components/FormSection';
import { FormActions } from '@@/form-components/FormActions';

import { NodeSelector } from '../../agent/NodeSelector';

import { FormValues } from './PullImageFormWidget.types';

export function PullImageForm({
  onRateLimit,
  isLoading,
  isNodeVisible,
}: {
  onRateLimit: (limited?: boolean) => void;
  isLoading: boolean;
  isNodeVisible: boolean;
}) {
  const { values, setFieldValue, errors, isValid } =
    useFormikContext<FormValues>();

  return (
    <Form className="form-horizontal">
      <ImageConfigFieldset
        autoComplete
        values={values.config}
        setFieldValue={(field, value) =>
          setFieldValue(`config.${field}`, value)
        }
        errors={errors.config}
        onRateLimit={onRateLimit}
      >
        <div className="form-group">
          <div className="col-sm-12 text-muted small">
            你当前正在使用匿名账户从 DockerHub 拉取镜像，因此每 6 小时最多只能拉取 100 次。你可以在“镜像仓库”页面中配置 DockerHub 认证。剩余拉取次数：100/100
          </div>
        </div>

        {isNodeVisible && (
          <FormSection title="部署">
            <NodeSelector
              value={values.node}
              onChange={(node) => setFieldValue('node', node)}
              error={errors.node}
            />
          </FormSection>
      )}

        <FormActions
          isLoading={isLoading}
          isValid={isValid}
          loadingText="下载中..."
          submitLabel="拉取镜像"
          data-cy="pull-image-button"
        />
      </ImageConfigFieldset>
    </Form>
  );
}
