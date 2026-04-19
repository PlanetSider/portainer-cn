import { FormikErrors } from 'formik';
import { MultiValue } from 'react-select';

import { Registry } from '@/react/portainer/registries/types/registry';
import { useEnvironmentRegistries } from '@/react/portainer/environments/queries/useEnvironmentRegistries';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { InlineLoader } from '@@/InlineLoader';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { RegistriesSelector } from './RegistriesSelector';

type Props = {
  values: MultiValue<Registry>;
  onChange: (value: MultiValue<Registry>) => void;
  errors?: string | string[] | FormikErrors<Registry>[];
  isEditingDisabled: boolean;
};

export function RegistriesFormSection({
  values,
  onChange,
  errors,
  isEditingDisabled,
}: Props) {
  const environmentId = useEnvironmentId();
  const registriesQuery = useEnvironmentRegistries(environmentId, {
    hideDefault: true,
  });
  return (
    <FormSection title="镜像仓库">
      {!isEditingDisabled && (
        <TextTip color="blue" className="mb-2">
          定义哪些镜像仓库可供拥有此命名空间访问权限的用户使用。
        </TextTip>
      )}
      <FormControl
        inputId="registries"
        label={isEditingDisabled ? '已选镜像仓库' : '选择镜像仓库'}
        errors={errors}
      >
        {registriesQuery.isLoading && (
          <InlineLoader>正在加载镜像仓库...</InlineLoader>
        )}
        {registriesQuery.data && (
          <RegistriesSelector
            value={values}
            onChange={(registries) => onChange(registries)}
            options={registriesQuery.data}
            inputId="registries"
            isEditingDisabled={isEditingDisabled}
          />
        )}
      </FormControl>
    </FormSection>
  );
}
