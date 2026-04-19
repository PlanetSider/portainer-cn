import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { BETeaserButton } from '@@/BETeaserButton';
import { Tooltip } from '@@/Tip/Tooltip';

export function AnnotationsBeTeaser() {
  return (
    <div className="col-sm-12 text-muted mb-2 block px-0">
      <div className="control-label !mb-2 text-left font-medium">
        注解
        <Tooltip
          message={
            <div className="vertical-center">
              <span>
                允许为对象指定{' '}
                <a
                  href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/"
                  target="_black"
                >
                  annotations
                </a>{' '}
                。更多信息请参考 Kubernetes 文档中的{' '}
                <a
                  href="https://kubernetes.io/docs/reference/labels-annotations-taints/"
                  target="_black"
                >
                  well-known annotations
                </a>
                .
              </span>
            </div>
          }
        />
      </div>
      <div className="block">
        <BETeaserButton
          className="!p-0"
          heading="添加注解"
          buttonText="添加注解"
          message="允许为此资源指定注解。"
          featureId={FeatureId.K8S_ANNOTATIONS}
          buttonClassName="!ml-0"
          data-cy="annotations-be-teaser"
        />
      </div>
    </div>
  );
}
