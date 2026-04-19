import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { BETeaserButton } from '@@/BETeaserButton';

export function RestartApplicationButton() {
  return (
    <BETeaserButton
      buttonClassName="!ml-0"
      data-cy="k8sAppDetail-restartButton"
      heading="滚动重启"
      featureId={FeatureId.K8S_ROLLING_RESTART}
      message="对应用执行滚动重启。"
      buttonText="滚动重启"
    />
  );
}
