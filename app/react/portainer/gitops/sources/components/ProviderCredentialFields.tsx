import { PasswordField } from './PasswordField';
import { UsernameField } from './UsernameField';

export type CredentialValues = {
  username?: string;
  password?: string;
};

type Props = {
  values: CredentialValues;
  isEditing?: boolean;
  errors?: { username?: string; password?: string };
  onChange: (values: Partial<CredentialValues>) => void;
};

export function ProviderCredentialFields({
  values: { username, password },
  isEditing = false,
  errors,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <UsernameField
        value={username || ''}
        onChange={(value) => onChange({ username: value })}
        error={errors?.username}
      />

      <PasswordField
        value={password || ''}
        onChange={(value) => onChange({ password: value })}
        label="个人访问令牌"
        tooltip="提供个人访问令牌或密码"
        error={errors?.password}
        required={!isEditing}
      />
    </div>
  );
}
