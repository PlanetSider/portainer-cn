import { bool, number, object, SchemaOf, string } from 'yup';

import { Values } from './types';

export function validation(): SchemaOf<Values> {
  return object({
    image: string().required('必须填写镜像'),
    registryId: number().default(0),
    useRegistry: bool().default(false),
  });
}
