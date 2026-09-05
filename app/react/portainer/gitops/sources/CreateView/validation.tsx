import { array, bool, mixed, number, object, SchemaOf, string } from 'yup';

import { ResourceControlOwnership } from '@/react/portainer/access-control/types';
import { stringEnumValues } from '@/types';

import { isValidUrl } from '@@/form-components/validate-url';

import { intervalValidation } from '../components/IntervalField';

import { FormValues, FormValueTypes } from './type';

export function validationSchema(): SchemaOf<FormValues> {
  return object({
    name: string().required('必须填写名称。'),
    type: mixed<FormValues['type']>()
      .oneOf([...FormValueTypes])
      .required()
      .default('git'),
    git: validateGit(),
    ownership: mixed<ResourceControlOwnership>()
      .oneOf(stringEnumValues(ResourceControlOwnership))
      .required(),
    authorizedTeams: array().of(number().required()),
    authorizedUsers: array().of(number().required()),
  });
}

export function validateGitConnection() {
  return validateGit().pick(['url', 'authentication', 'tlsSkipVerify']);
}

function validateGit(): SchemaOf<FormValues['git']> {
  return object({
    authentication: object({
      authEnabled: bool().required().default(false),
      username: string().when('authEnabled', {
        is: true,
        then: string().required('必须填写用户名'),
      }),
      password: string().when('authEnabled', {
        is: true,
        then: string().required('必须填写密码'),
      }),
    }),
    url: string()
      .required('必须填写 Repository URL。')
      .test(
        'valid repository URL',
        'Repository URL 必须是有效 URL（不能使用 localhost）',
        (value) =>
          isValidUrl(
            value,
            (url) => !!url.hostname && url.hostname !== 'localhost'
          )
      ),
    tlsSkipVerify: bool(),
    polling: object({
      enabled: bool().required().default(false),
      interval: string().default('').when('enabled', {
        is: true,
        then: intervalValidation(),
      }),
    }),
    connectionOk: bool()
      .oneOf([true], '连接测试成功后才能继续。')
      .required(),
  });
}
