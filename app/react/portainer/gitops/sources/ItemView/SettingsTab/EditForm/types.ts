import { boolean as yupBoolean, object, string } from 'yup';

export interface SettingsFormValues {
  name: string;
  url: string;
  tlsSkipVerify: boolean;
  authEnabled: boolean;
  username: string;
  password: string;
}

export const validationSchema = object({
  name: string().required('必须填写名称'),
  url: string().required('必须填写 Repository URL'),
  tlsSkipVerify: yupBoolean().defined(),
  authEnabled: yupBoolean().defined(),
  username: string().when('authEnabled', {
    is: true,
    then: (schema) => schema.required('必须填写用户名'),
    otherwise: (schema) => schema.optional(),
  }),
  password: string().optional(),
});
