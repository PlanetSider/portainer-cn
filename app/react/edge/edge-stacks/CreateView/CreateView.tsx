import { PageHeader } from '@@/PageHeader';

import { CreateForm } from './CreateForm';

export function CreateView() {
  return (
    <>
      <PageHeader
        title="创建 Edge 堆栈"
        breadcrumbs={[
          { label: 'Edge 堆栈', link: 'edge.stacks' },
          '创建 Edge 堆栈',
        ]}
        reload
      />

      <CreateForm />
    </>
  );
}
