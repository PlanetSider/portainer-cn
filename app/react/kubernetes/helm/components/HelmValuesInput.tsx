import { FormControl } from '@@/form-components/FormControl';
import { CodeEditor } from '@@/CodeEditor';
import { ShortcutsTooltip } from '@@/CodeEditor/ShortcutsTooltip';

type Props = {
  values: string;
  setValues: (values: string) => void;
  valuesRef: string;
  isValuesRefLoading: boolean;
};

export function HelmValuesInput({
  values,
  setValues,
  valuesRef,
  isValuesRefLoading,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormControl
        label="用户自定义值"
        inputId="user-values-editor"
        size="vertical"
        className="!mx-0 [&>label]:!mb-1"
        tooltip={
          <>
            用户自定义值将覆盖 Chart 的默认值。
            <br />
            你可以在{' '}
            <a
              href="https://helm.sh/docs/chart_template_guide/values_files/"
              target="_blank"
              data-cy="helm-values-reference-link"
              rel="noreferrer"
            >
              官方文档
            </a>
            中了解更多关于 Helm values 文件格式的信息。
          </>
        }
      >
        <CodeEditor
          id="user-values-editor"
          value={values}
          onChange={setValues}
          height="50vh"
          type="yaml"
          data-cy="helm-user-values-editor"
          placeholder="在此定义或粘贴你的 Values YAML 文件内容"
          showToolbar={false}
        />
      </FormControl>
      <FormControl
        label={
          <div className="flex w-full justify-between">
            值参考（只读）
            <ShortcutsTooltip />
          </div>
        }
        inputId="values-reference"
        size="vertical"
        isLoading={isValuesRefLoading}
        loadingText="正在加载值..."
        className="!mx-0 [&>label]:!mb-1 [&>label]:w-full"
      >
        <CodeEditor
          id="values-reference"
          value={valuesRef}
          height="50vh"
          type="yaml"
          readonly
          data-cy="helm-values-reference"
          placeholder="未找到值参考"
          showToolbar={false}
        />
      </FormControl>
    </div>
  );
}
