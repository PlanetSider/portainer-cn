import ingressDiagram from '@/assets/images/ingress-explanatory-diagram.png';

import { FormSection } from '@@/form-components/FormSection';

export function PublishingExplaination() {
  return (
    <FormSection title="说明" isFoldable titleSize="sm">
      <div className="mb-4 flex w-full flex-col items-start lg:flex-row">
        <img
          src={ingressDiagram}
          alt="Ingress 说明图"
          width={646}
          className="flex w-full max-w-2xl basis-1/2 flex-col rounded border border-solid border-gray-5 object-contain lg:w-1/2"
        />
        <div className="text-muted ml-8 basis-1/2 text-xs">
          通过{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/service/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Service
          </a>{' '}
          和{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/ingress/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ingress
          </a>
          暴露应用工作负载：
          <ul className="ml-5 mt-3 [&>li>ul>li]:ml-5 [&>li]:mb-3">
            <li>
              仅在集群内通过 <b>ClusterIP Service</b>
              <ul>
                <li>
                  <i>默认的 Service 类型。</i>
                </li>
              </ul>
            </li>
            <li>
              通过 <b>ClusterIP Service</b> 在集群内访问，通过 <b>Ingress</b> 在集群外访问
              <ul>
                <li>
                  <i>
                    Ingress 管理对集群内（通常为 ClusterIP）Service 的外部访问，并支持定义路由规则、SSL 终止及其他高级功能。
                  </i>
                </li>
              </ul>
            </li>
            <li>
              通过 <b>NodePort Service</b> 在集群内外访问
              <ul>
                <li>
                  <i>
                    这会在每个节点上使用固定端口发布工作负载，使外部用户可以通过节点 IP 地址和端口访问。通常不建议在生产环境中使用。
                  </i>
                </li>
              </ul>
            </li>
            <li>
              通过 <b>LoadBalancer Service</b> 在集群内外访问
              <ul>
                <li>
                  <i>
                    如果运行在云平台上，系统会自动配置云负载均衡器，并分配外部 IP 地址或 DNS，将流量路由到工作负载。
                  </i>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}
