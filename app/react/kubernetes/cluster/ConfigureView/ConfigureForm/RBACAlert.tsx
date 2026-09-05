import { Alert } from '@@/Alert';

export function RBACAlert() {
  return (
    <Alert color="warn" className="mb-4">
      <div className="flex flex-col">
        <p>
          集群未启用 Kubernetes 基于角色的访问控制（RBAC）。
        </p>
        <p>
          这意味着你无法使用 Portainer RBAC 功能，根据用户角色控制对环境资源的访问。
        </p>
        <p className="mb-0">
          要启用 RBAC，请启动&nbsp;
          <a
            className="th-highcontrast:text-blue-4 th-dark:text-blue-7"
            href="https://kubernetes.io/docs/concepts/overview/components/#kube-apiserver"
            target="_blank"
            rel="noreferrer"
          >
            API server
          </a>
          &nbsp;并将&nbsp;
          <code className="bg-gray-4 box-decoration-clone th-highcontrast:bg-black th-dark:bg-black">
            --authorization-mode
          </code>
          &nbsp;标志设置为包含&nbsp;
          <code className="bg-gray-4 th-highcontrast:bg-black th-dark:bg-black">
            RBAC
          </code>
          &nbsp;的逗号分隔列表，例如：&nbsp;
          <code className="bg-gray-4 box-decoration-clone th-highcontrast:bg-black th-dark:bg-black">
            kube-apiserver --authorization-mode=Example1,RBAC,Example2
          </code>
          .
        </p>
      </div>
    </Alert>
  );
}
