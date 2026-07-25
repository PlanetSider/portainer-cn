import { useWizardSteps } from '@@/Stepper/useWizardSteps';
import { PageHeader } from '@@/PageHeader';

import { TypeSelectStep, validateTypeSelectStep } from './steps/TypeSelectStep';
import { ConfigureStep, validateConfigureStep } from './steps/ConfigureStep';
import { WizardStep, WizardProvider } from './WizardContext';
import { CreateForm } from './CreateForm';
import {
  AccessControlStep,
  validateAccessControlStep,
} from './steps/AccessControlStep';

const steps: WizardStep[] = [
  {
    id: 'type',
    label: '选择来源类型',
    component: TypeSelectStep,
    validateStep: validateTypeSelectStep,
  },
  {
    id: 'configure',
    label: '配置连接',
    component: ConfigureStep,
    validateStep: validateConfigureStep,
  },
  {
    id: 'access',
    label: '访问控制',
    component: AccessControlStep,
    validateStep: validateAccessControlStep,
  },
];

export function CreateView() {
  const context = useWizardSteps<WizardStep>({ steps });

  return (
    <div className="form-horizontal pb-20">
      <PageHeader
        title="创建来源"
        breadcrumbs={[
          { link: '.^', label: 'GitOps 来源' },
          { label: '创建来源' },
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <WizardProvider context={context}>
            <CreateForm steps={steps} />
          </WizardProvider>
        </div>
      </div>
    </div>
  );
}
