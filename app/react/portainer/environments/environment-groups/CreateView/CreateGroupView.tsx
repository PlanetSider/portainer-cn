import { useRouter } from '@uirouter/react';
import { FormikHelpers } from 'formik';

import { notifySuccess } from '@/portainer/services/notifications';

import { Widget } from '@@/Widget';
import { PageHeader } from '@@/PageHeader';

import { useCreateGroupMutation } from '../queries/useCreateGroupMutation';
import { GroupForm, GroupFormValues } from '../components/GroupForm';

export function CreateGroupView() {
  const router = useRouter();
  const createMutation = useCreateGroupMutation();

  const initialValues: GroupFormValues = {
    name: '',
    description: '',
    tagIds: [],
    associatedEnvironments: [],
  };

  return (
    <>
      <PageHeader
        title="创建分组"
        breadcrumbs={[
          { label: '分组', link: 'portainer.groups' },
          { label: '创建分组' },
        ]}
      />

      <div className="row pb-20">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body>
              <GroupForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitLabel="创建"
                submitLoadingLabel="创建中..."
              />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );

  async function handleSubmit(
    values: GroupFormValues,
    { resetForm }: FormikHelpers<GroupFormValues>
  ) {
    await createMutation.mutateAsync(
      {
        name: values.name,
        description: values.description,
        tagIds: values.tagIds,
        associatedEnvironments: values.associatedEnvironments,
      },
      {
        onSuccess: () => {
          resetForm();
          notifySuccess('成功', '分组已成功创建');
          router.stateService.go('portainer.groups');
        },
      }
    );
  }
}
