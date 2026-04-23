import { useMemo } from 'react';
import { Settings } from 'lucide-react';
import { Formik, Form as FormikForm } from 'formik';
import { useRouter } from '@uirouter/react';

import { notifySuccess } from '@/portainer/services/notifications';
import { withLimitToBE } from '@/react/hooks/useLimitToBE';
import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';
import { LoadingButton } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

import { ScheduleType } from '../types';
import { useCreateMutation } from '../queries/create';
import { FormValues } from '../common/types';
import { validation } from '../common/validation';
import { ScheduleTypeSelector } from '../common/ScheduleTypeSelector';
import { useList } from '../queries/list';
import { NameField } from '../common/NameField';
import { EdgeGroupsField } from '../common/EdgeGroupsField';
import { BetaAlert } from '../common/BetaAlert';
import { defaultValue } from '../common/ScheduledTimeField';

export default withLimitToBE(CreateView);

function CreateView() {
  const initialValues = useMemo<FormValues>(
    () => ({
      name: '',
      groupIds: [],
      type: ScheduleType.Update,
      version: '',
      scheduledTime: defaultValue(),
    }),
    []
  );
  const edgeGroupsQuery = useEdgeGroups();
  const schedulesQuery = useList();

  const createMutation = useCreateMutation();
  const router = useRouter();

  if (!schedulesQuery.data) {
    return null;
  }

  const schedules = schedulesQuery.data;

  return (
    <>
      <PageHeader
        title="更新与回滚"
        breadcrumbs="Edge Agent 更新与回滚"
        reload
      />

      <BetaAlert
        className="mb-2 ml-[15px]"
        message="Beta 功能 - 当前仅限独立 Linux Edge 设备使用。"
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Title title="更新与回滚计划器" icon={Settings} />
            <Widget.Body>
              <TextTip color="blue" className="mb-2">
                设备需要先分配到某个 Edge 分组，请前往{' '}
                <Link
                  to="edge.groups"
                  data-cy="update-schedules-create-edge-groups-link"
                >
                  Edge 分组
                </Link>{' '}
                页面分配环境并创建分组。
                <br />
                仅支持从任意 Agent 版本升级到 2.17 或更高版本。
                不支持升级到 2.17 之前的 Agent 版本。回滚到原始版本的能力仅适用于 2.15.0+。
              </TextTip>

              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validateOnMount
                validationSchema={() =>
                  validation(schedules, edgeGroupsQuery.data)
                }
              >
                {({ isValid, setFieldValue, values, handleBlur, errors }) => (
                  <FormikForm className="form-horizontal">
                    <NameField />
                    <EdgeGroupsField
                      onChange={(value) => setFieldValue('groupIds', value)}
                      value={values.groupIds}
                      onBlur={handleBlur}
                      error={errors.groupIds}
                    />

                    <div className="mt-2">
                      <ScheduleTypeSelector />
                    </div>

                    <div className="form-group">
                      <div className="col-sm-12">
                        <LoadingButton
                          disabled={!isValid}
                          data-cy="update-schedules-create-submit-button"
                          isLoading={createMutation.isLoading}
                          loadingText="创建中..."
                        >
                          创建计划
                        </LoadingButton>
                      </div>
                    </div>
                  </FormikForm>
                )}
              </Formik>
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );

  function handleSubmit(values: FormValues) {
    createMutation.mutate(values, {
      onSuccess() {
        notifySuccess('Success', 'Created schedule successfully');
        router.stateService.go('^');
      },
    });
  }
}
