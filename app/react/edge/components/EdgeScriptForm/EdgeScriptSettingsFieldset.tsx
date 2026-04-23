import { useFormikContext, Field } from 'formik';

import { GroupField } from '@/react/portainer/environments/common/MetadataFieldset/GroupsField';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';
import { TagSelector } from '@@/TagSelector';

import { EdgeGroupsSelector } from '../../edge-stacks/components/EdgeGroupsSelector';

import { ScriptFormValues } from './types';

interface Props {
  hideIdGetter?: boolean;
  showMetaFields?: boolean;
}

export function EdgeScriptSettingsFieldset({
  hideIdGetter,
  showMetaFields,
}: Props) {
  const { values, setFieldValue, errors } =
    useFormikContext<ScriptFormValues>();

  return (
    <>
      {showMetaFields && (
        <>
          <GroupField name="group" />

          <EdgeGroupsSelector
            value={values.edgeGroupsIds}
            onChange={(value) => setFieldValue('edgeGroupsIds', value)}
            isGroupVisible={(group) => !group.Dynamic}
            horizontal
          />

          <TagSelector
            value={values.tagsIds}
            onChange={(value) => setFieldValue('tagsIds', value)}
          />
        </>
      )}

      {!hideIdGetter && (
        <>
          <FormControl
            label="Edge ID 生成器"
            tooltip="输入一条可生成唯一 Edge ID 的单行 bash 命令。例如可以使用 'uuidgen' 或 'uuid'。结果将被赋值给 'PORTAINER_EDGE_ID' 环境变量。"
            inputId="edge-id-generator-input"
            required
            errors={errors.edgeIdGenerator}
          >
            <Input
              type="text"
              value={values.edgeIdGenerator}
              name="edgeIdGenerator"
              placeholder="例如 uuidgen"
              id="edge-id-generator-input"
              onChange={(e) => setFieldValue(e.target.name, e.target.value)}
              data-cy="edge-id-generator-input"
            />
          </FormControl>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                <code>PORTAINER_EDGE_ID</code> 环境变量是 Edge Agent 成功连接到 Portainer 所必需的
              </TextTip>
            </div>
          </div>
        </>
      )}

      <FormControl
        label="环境变量"
        tooltip="以逗号分隔的环境变量列表，这些变量将从部署 Agent 的主机中读取。"
        inputId="env-variables-input"
      >
        <Field
          name="envVars"
          as={Input}
          placeholder="例如 foo=bar"
          id="env-variables-input"
        />
      </FormControl>

      <TextTip color="orange" className="icon-orange mb-2">
        出于安全考虑，只有以 &apos;PORTAINER_&apos; 为前缀的环境变量才可被访问。
      </TextTip>

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.allowSelfSignedCertificates}
            data-cy="allow-self-signed-certs-switch"
            onChange={(value) =>
              setFieldValue('allowSelfSignedCertificates', value)
            }
            label="允许自签名证书"
            labelClass="col-sm-3 col-lg-2"
            tooltip="允许自签名证书时，Edge Agent 在通过 HTTPS 连接 Portainer 时会忽略域名校验。"
          />
        </div>
      </div>
    </>
  );
}
