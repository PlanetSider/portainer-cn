import { CopyButton } from '@@/buttons';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { Code } from '@@/Code';

export function EdgeKeyDisplay({ edgeKey }: { edgeKey: string }) {
  return (
    <FormSection title="接入令牌">
      <TextTip color="blue">
        如果你需要预先部署 Edge Agent，可使用下方接入令牌将 Edge Agent
        关联到当前环境。
      </TextTip>

      <p className="small text-muted mt-2">
        关于预部署的更多说明，可查看用户指南{' '}
        <a href="https://downloads.portainer.io/edge_agent_guide.pdf">这里</a>。
      </p>

      <Code>{edgeKey}</Code>

      <CopyButton
        copyText={edgeKey}
        className="mt-2"
        data-cy="copy-edge-key-button"
      >
        复制令牌
      </CopyButton>
    </FormSection>
  );
}
