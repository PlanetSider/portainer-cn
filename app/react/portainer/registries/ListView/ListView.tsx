import { PageHeader } from '@@/PageHeader';
import { InformationPanel } from '@@/InformationPanel';

import { RegistriesDatatable } from './RegistriesDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="镜像仓库" breadcrumbs="仓库管理" reload />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel title="说明">
            <span className="small text-muted">
              请通过环境视图查看镜像仓库，以管理用户和/或团队的访问权限
            </span>
          </InformationPanel>
        </div>
      </div>

      <RegistriesDatatable />
    </>
  );
}
