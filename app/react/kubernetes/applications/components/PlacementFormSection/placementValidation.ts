import { SchemaOf, array, boolean, mixed, object, string } from 'yup';

import { PlacementsFormValues } from './types';

export function placementsValidation(): SchemaOf<PlacementsFormValues> {
  return object({
    placementType: mixed().oneOf(['mandatory', 'preferred']).required(),
    placements: array(
      object({
        label: string().required('节点标签为必填项。'),
        value: string().required('节点标签值为必填项。'),
        needsDeletion: boolean(),
      }).required()
    ),
  });
}
