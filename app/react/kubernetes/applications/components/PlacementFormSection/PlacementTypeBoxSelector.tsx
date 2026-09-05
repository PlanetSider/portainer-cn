import { Sliders, AlignJustify } from 'lucide-react';

import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';

import { PlacementType } from './types';

type Props = {
  placementType: PlacementType;
  onChange: (placementType: PlacementType) => void;
};

export const placementOptions: ReadonlyArray<BoxSelectorOption<PlacementType>> =
  [
    {
      id: 'placement_hard',
      value: 'mandatory',
      icon: Sliders,
      iconType: 'badge',
      label: '强制',
      description: (
        <>
          <b>仅</b>将此应用调度到满足<b>全部</b>规则的节点上
        </>
      ),
    },
    {
      id: 'placement_soft',
      value: 'preferred',
      icon: AlignJustify,
      iconType: 'badge',
      label: '首选',
      description: '尽可能将此应用调度到满足规则的节点上',
    },
  ] as const;

export function PlacementTypeBoxSelector({ placementType, onChange }: Props) {
  return (
    <BoxSelector<PlacementType>
      value={placementType}
      options={placementOptions}
      onChange={(placementType) => onChange(placementType)}
      radioName="placementType"
      slim
    />
  );
}
