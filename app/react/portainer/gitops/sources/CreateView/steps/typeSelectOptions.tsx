import { Cylinder, Radio } from 'lucide-react';

import GitIcon from '@/assets/ico/git.svg?c';
import HelmIcon from '@/assets/ico/helm.svg?c';

import { BoxSelectorOption } from '@@/BoxSelector';

const git: BoxSelectorOption<'git'> = {
  id: 'git',
  label: 'Git Repository',
  value: 'git',
  icon: GitIcon,
  iconType: 'logo',
  description: Description({
    txt: '连接 Git Repository（GitHub、GitLab、Bitbucket 等），拉取配置文件、Manifest 和其他部署资源。',
    items: ['选择分支和标签', 'SSH 或 HTTPS 认证', '支持 Webhook'],
  }),
};

const helm: BoxSelectorOption<'helm'> = {
  id: 'helm',
  value: 'helm',
  label: 'Helm Repository',
  icon: HelmIcon,
  iconType: 'logo',
  description: Description({
    txt: '连接 Helm Chart Repository，以便在各环境中部署和管理 Helm Chart。',
    items: ['Chart 版本管理', 'Values 自定义', '依赖项管理'],
  }),
  disabled: true,
};

const registry: BoxSelectorOption<'registry'> = {
  id: 'registry',
  value: 'registry',
  label: 'OCI Registry',
  icon: Radio,
  description: Description({
    txt: '连接兼容 OCI 的容器 Registry，以拉取制品和容器镜像。',
    items: ['镜像标签和摘要', '私有 Registry 认证', '支持制品'],
  }),
  disabled: true,
};

const s3: BoxSelectorOption<'s3'> = {
  id: 's3',
  value: 's3',
  label: 'S3 存储桶',
  icon: Cylinder,
  description: Description({
    txt: '连接兼容 S3 的存储桶（AWS S3、MinIO 等），获取配置文件和资源。',
    items: ['前缀筛选', 'IAM 或密钥认证', '版本支持'],
  }),
  disabled: true,
};

export const sourceTypeOptions = [git, helm, registry, s3];

function Description({ txt, items }: { txt: string; items: string[] }) {
  return (
    <div>
      {txt}
      <div className="pl-4 pt-2">
        <ul>
          {items.map((v, k) => (
            <li key={k}>{v}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
