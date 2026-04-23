import { Shield } from 'lucide-react';

import { BoxSelectorOption } from '@@/BoxSelector';

export const tlsOptions: ReadonlyArray<BoxSelectorOption<string>> = [
  {
    id: 'tls_client_ca',
    value: 'tls_client_ca',
    icon: Shield,
    iconType: 'badge',
    label: 'TLS（服务端与客户端双向校验）',
    description: '使用客户端证书，并校验服务端证书',
  },
  {
    id: 'tls_client_noca',
    value: 'tls_client_noca',
    icon: Shield,
    iconType: 'badge',
    label: 'TLS（仅客户端校验）',
    description: '使用客户端证书，但不校验服务端证书',
  },
  {
    id: 'tls_ca',
    value: 'tls_ca',
    icon: Shield,
    iconType: 'badge',
    label: 'TLS（仅服务端校验）',
    description: '仅校验服务端证书',
  },
  {
    id: 'tls_only',
    value: 'tls_only',
    icon: Shield,
    iconType: 'badge',
    label: '仅 TLS',
    description: '不进行服务端/客户端证书校验',
  },
] as const;
