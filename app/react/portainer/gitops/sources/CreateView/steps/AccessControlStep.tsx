import { useFormikContext } from 'formik';

import { EditDetails } from '@/react/portainer/access-control/EditDetails';

import { Widget } from '@@/Widget';

import { validationSchema } from '../validation';
import { FormValues } from '../type';

export function AccessControlStep() {
  const { values, errors, setValues } = useFormikContext<FormValues>();

  return (
    <>
      <Widget.Title
        title="访问控制"
        subtitle="配置哪些用户可以使用此来源创建工作流和部署。"
      />
      <Widget.Body>
        <EditDetails
          resourceName="source"
          values={values}
          onChange={({ ownership, authorizedTeams, authorizedUsers }) => {
            setValues((values) => ({
              ...values,
              ownership,
              authorizedTeams,
              authorizedUsers,
            }));
          }}
          errors={errors}
          isPublicVisible
        />
      </Widget.Body>
    </>
  );
}

export function validateAccessControlStep() {
  return validationSchema().pick([
    'ownership',
    'authorizedUsers',
    'authorizedTeams',
  ]);
}
