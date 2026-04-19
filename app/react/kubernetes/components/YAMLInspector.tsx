import { useMemo, useState } from 'react';
import YAML from 'yaml';
import { Minus, Plus } from 'lucide-react';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { AutomationTestingProps } from '@/types';

import { WebEditorForm } from '@@/WebEditorForm';
import { Button } from '@@/buttons';
import { BETeaserButton } from '@@/BETeaserButton';
import { Alert } from '@@/Alert';
import { Loading } from '@@/Widget/Loading';

type Props = {
  identifier: string;
  data: string;
  hideMessage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
} & AutomationTestingProps;

export function YAMLInspector({
  identifier,
  data,
  hideMessage,
  'data-cy': dataCy,
  isLoading,
  isError,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const yaml = useMemo(() => cleanYamlUnwantedFields(data), [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Alert color="error">加载 YAML 失败</Alert>;
  }

  return (
    <div>
      <WebEditorForm
        data-cy={dataCy}
        value={yaml}
        textTip={
          hideMessage
            ? undefined
             : '在这里编写或粘贴 manifest 内容'
        }
        readonly
        hideTitle
        id={identifier}
        type="yaml"
        height={expanded ? '800px' : '500px'}
        onChange={() => {}} // all kube yaml inspectors in CE are read only
      />
      <div className="flex items-center justify-between py-5">
        <Button
          icon={expanded ? Minus : Plus}
          data-cy={`expand-collapse-yaml-${identifier}`}
          color="default"
          className="!ml-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '收起' : '展开'}
        </Button>
        <BETeaserButton
          featureId={FeatureId.K8S_EDIT_YAML}
          heading="应用 YAML 更改"
          message="通过调用 Kubernetes API 对相关资源执行 patch，以应用你在 YAML 编辑器中所做的更改。YAML 中删除资源或意外新增资源的操作会被忽略。注意：位于 system 命名空间中的资源禁止编辑。"
          buttonText="应用更改"
          data-cy="yaml-inspector-apply-changes-teaser-button"
        />
      </div>
    </div>
  );
}

export function cleanYamlUnwantedFields(yml: string) {
  try {
    const ymls = yml.split('---');
    const cleanYmls = ymls.map((yml) => {
      const y = YAML.parse(yml);
      if (y.metadata) {
        const { managedFields, resourceVersion, ...metadata } = y.metadata;
        y.metadata = metadata;
      }
      return YAML.stringify(y);
    });
    return cleanYmls.join('---\n');
  } catch (e) {
    return yml;
  }
}
