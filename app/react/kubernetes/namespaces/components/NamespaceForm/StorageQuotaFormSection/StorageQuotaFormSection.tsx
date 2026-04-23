import { StorageClass } from '@/react/portainer/environments/types';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { StorageQuotaItem } from './StorageQuotaItem';

interface Props {
  storageClasses: StorageClass[];
}

export function StorageQuotaFormSection({ storageClasses }: Props) {
  return (
    <FormSection title="存储 Storage">
      <TextTip color="blue">
        你可以为每种存储选项设置配额，以防止用户在部署应用时超出特定阈值。将配额设为 0 可有效禁止在此命名空间中使用该存储选项。
      </TextTip>

      {storageClasses.map((storageClass) => (
        <StorageQuotaItem key={storageClass.Name} storageClass={storageClass} />
      ))}
    </FormSection>
  );
}
