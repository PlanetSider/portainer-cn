import { truncateLeftRight } from '@/portainer/filters/filters';

import { HelpLink } from '@@/HelpLink';
import { CopyButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';

export function WebhookSettings({
  value,
  baseUrl,
  docsLink,
}: {
  docsLink?: string;
  value: string;
  baseUrl: string;
}) {
  const url = `${baseUrl}/${value}`;

  return (
    <FormControl
      label="Webhook"
      tooltip={
        !!docsLink && (
          <>
            See{' '}
            <HelpLink docLink={docsLink}>
              Portainer 关于 Webhook 用法的文档
            </HelpLink>
            .
          </>
        )
      }
    >
      <div className="flex items-center gap-2">
        <span
          className="text-muted"
          aria-label="webhook url"
          role="textbox"
          aria-readonly
        >
          {truncateLeftRight(url)}
        </span>
        <CopyButton
          copyText={url}
          color="light"
          data-cy="copy-webhook-link-button"
        >
          复制链接
        </CopyButton>
      </div>
    </FormControl>
  );
}
