import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { FormSection } from '@@/form-components/FormSection';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

export function LoadBalancerFormSection() {
  return (
    <FormSection title="负载均衡器 Load balancers">
      <TextTip color="blue">
        你可以为该命名空间中允许创建的外部负载均衡器数量设置配额。将配额设为 0 可有效禁用此命名空间中的负载均衡器使用。
      </TextTip>
      <SwitchField
        data-cy="k8sNamespaceCreate-loadBalancerQuotaToggle"
        label="负载均衡器配额"
        labelClass="col-sm-3 col-lg-2"
        fieldClass="pt-2"
        checked={false}
        featureId={FeatureId.K8S_RESOURCE_POOL_LB_QUOTA}
        onChange={() => {}}
      />
    </FormSection>
  );
}
