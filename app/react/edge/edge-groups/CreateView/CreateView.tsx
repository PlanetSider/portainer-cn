import { useRouter } from '@uirouter/react';

import { notifySuccess } from '@/portainer/services/notifications';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';

import { useCreateEdgeGroupMutation } from '../queries/useCreateEdgeGroupMutation';
import { EdgeGroupForm } from '../components/EdgeGroupForm/EdgeGroupForm';

export function CreateView() {
  const mutation = useCreateEdgeGroupMutation();
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="创建边缘分组"
        breadcrumbs={[
          { label: '边缘分组', link: 'edge.groups' },
          '添加边缘分组',
        ]}
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body>
              <EdgeGroupForm
                onSubmit={({ environmentIds, ...values }) => {
                  mutation.mutate(
                    {
                      endpoints: environmentIds,
                      ...values,
                    },
                    {
                      onSuccess: () => {
                        notifySuccess(
                          '成功',
                          '边缘分组创建成功'
                        );
                        router.stateService.go('^');
                      },
                    }
                  );
                }}
                isLoading={mutation.isLoading}
              />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}
