import { useState, useMemo } from 'react';

import { PortainerSelect } from '@/react/components/form-components/PortainerSelect';

import { SearchBar } from '@@/datatables/SearchBar';
import { InlineLoader } from '@@/InlineLoader';

import { Chart } from '../types';
import { RepoValue } from '../components/HelmRegistrySelect';

import { HelmTemplatesListItem } from './HelmTemplatesListItem';

interface Props {
  isLoadingCharts: boolean;
  charts?: Chart[];
  selectAction: (chart: Chart) => void;
  selectedRegistry: RepoValue | null;
}

export function HelmTemplatesList({
  isLoadingCharts,
  charts = [],
  selectAction,
  selectedRegistry,
}: Props) {
  const [textFilter, setTextFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => getCategories(charts), [charts]);

  const filteredCharts = useMemo(
    () => getFilteredCharts(charts, textFilter, selectedCategory),
    [charts, textFilter, selectedCategory]
  );

  const isSelectedRegistryEmpty =
    !isLoadingCharts && charts.length === 0 && selectedRegistry;

  return (
    <section className="datatable" aria-label="Helm charts">
      <div className="toolBar vertical-center relative w-full !gap-x-5 !gap-y-1 overflow-auto !px-0">
        <div className="toolBarTitle vertical-center whitespace-nowrap">
          从 {selectedRegistry?.name} 选择 Helm Chart
        </div>

        <SearchBar
          value={textFilter}
          onChange={(value) => setTextFilter(value)}
            placeholder="搜索..."
          data-cy="helm-templates-search"
          className="!mr-0 h-9"
        />

        <div className="w-full flex-none sm:w-1/4">
          <PortainerSelect
            placeholder="选择分类"
            value={selectedCategory}
            options={categories}
            onChange={setSelectedCategory}
            isClearable
            bindToBody
            data-cy="helm-category-select"
          />
        </div>
      </div>

      <div className="blocklist !px-0" role="list">
        {filteredCharts.map((chart) => (
          <HelmTemplatesListItem
            key={chart.name}
            model={chart}
            onSelect={selectAction}
          />
        ))}

        {filteredCharts.length === 0 && textFilter && !isLoadingCharts && (
          <div className="text-muted small mt-4">未找到 Helm Chart</div>
        )}

        {isLoadingCharts && (
          <div className="flex flex-col">
            <InlineLoader className="justify-center">
              正在加载 Helm Chart...
            </InlineLoader>
            {charts.length === 0 && (
              <div className="text-muted text-center">
                Helm Chart 首次下载可能需要几分钟
              </div>
            )}
          </div>
        )}

        {isSelectedRegistryEmpty && (
          <div className="text-muted text-center">
            此仓库中没有可用的 Helm Chart。
          </div>
        )}

        {!selectedRegistry && (
          <div className="text-muted text-center">
            请选择仓库以查看可用的 Helm Chart。
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Get categories from charts
 * @param charts - The charts to get the categories from
 * @returns Categories
 */
function getCategories(charts: Chart[]) {
  const annotationCategories = charts
    .map((chart) => chart.annotations?.category) // get category
    .filter((c): c is string => !!c); // filter out nulls/undefined

  const availableCategories = [...new Set(annotationCategories)].sort(); // unique and sort

  // Create options array in the format expected by PortainerSelect
  return availableCategories.map((cat) => ({
    label: cat,
    value: cat,
  }));
}

/**
 * Get filtered charts
 * @param charts - The charts to get the filtered charts from
 * @param textFilter - The text filter
 * @param selectedCategory - The selected category
 * @returns Filtered charts
 */
function getFilteredCharts(
  charts: Chart[],
  textFilter: string,
  selectedCategory: string | null
) {
  return charts.filter((chart) => {
    // Text filter
    if (
      textFilter &&
      !chart.name.toLowerCase().includes(textFilter.toLowerCase()) &&
      !chart.description.toLowerCase().includes(textFilter.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      selectedCategory &&
      (!chart.annotations || chart.annotations.category !== selectedCategory)
    ) {
      return false;
    }

    return true;
  });
}
