import { useState } from 'react';
import { useRouter } from '@uirouter/react';
import { Wand2 } from 'lucide-react';

import { Button } from '@@/buttons';
import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { FormSection } from '@@/form-components/FormSection';

import { EnvironmentSelector } from './EnvironmentSelector';
import {
  EnvironmentOptionValue,
  existingEnvironmentTypes,
  newEnvironmentTypes,
} from './environment-types';

export function EnvironmentTypeSelectView() {
  const [types, setTypes] = useState<EnvironmentOptionValue[]>([]);
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="快速设置"
        breadcrumbs={[{ label: '环境向导' }]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetTitle icon={Wand2} title="环境向导" />
            <WidgetBody>
              <div className="form-horizontal">
                <FormSection title="选择你的环境">
                  <p className="text-muted small">
                    你可以接入不同类型的环境，请选择所有适用项。
                  </p>
                  <p className="control-label !mb-2">
                    连接现有环境
                  </p>
                  <EnvironmentSelector
                    value={types}
                    onChange={setTypes}
                    options={existingEnvironmentTypes}
                  />
                  <p className="control-label !mb-2">创建新环境</p>
                  <EnvironmentSelector
                    value={types}
                    onChange={setTypes}
                    options={newEnvironmentTypes}
                    hiddenSpacingCount={
                      existingEnvironmentTypes.length -
                      newEnvironmentTypes.length
                    }
                  />
                </FormSection>
              </div>
              <Button
                disabled={types.length === 0}
                data-cy="start-wizard-button"
                onClick={() => startWizard()}
                className="!ml-0"
              >
                开始向导
              </Button>
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );

  function startWizard() {
    if (types.length === 0) {
      return;
    }

    router.stateService.go('portainer.wizard.endpoints.create', {
      envType: types,
    });
  }
}
