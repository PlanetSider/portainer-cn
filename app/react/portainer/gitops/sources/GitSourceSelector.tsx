import { AddButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';
import { PortainerSelect } from '@@/form-components/PortainerSelect';

import { useSources } from './queries/useSources';
import { Source } from './types';

export function GitSourceSelector({
  value,
  onChange,
  error,
  readOnly = false,
}: {
  value?: Source['id'];
  onChange?(source?: Source | null): void;
  error?: string;
  readOnly?: boolean;
}) {
  const sourcesQuery = useSources({ type: 'git' });
  const sources = sourcesQuery.data?.data ?? [];
  const options = sources.map((source) => ({
    label: source.name,
    value: source.id,
  }));

  return (
    <div className="form-group">
      <div className="col-sm-12">
        <FormControl label="来源" inputId="source-selector" errors={error}>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <PortainerSelect
                placeholder="选择来源"
                value={value ?? 0}
                options={options}
                onChange={(sourceId) =>
                  onChange?.(sources.find((source) => source.id === sourceId))
                }
                isClearable
                isLoading={sourcesQuery.isLoading}
                noOptionsMessage={() => '没有可用的 Git 来源'}
                inputId="source-selector"
                data-cy="source-selector"
                disabled={readOnly}
              />
            </div>
            <AddButton
              to="portainer.gitops.sources.new"
              data-cy="create-source-button"
            >
              创建来源
            </AddButton>
          </div>
        </FormControl>
      </div>
    </div>
  );
}
