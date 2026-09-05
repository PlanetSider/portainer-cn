import clsx from 'clsx';
import { Fragment } from 'react';
import { Taint } from 'kubernetes-types/core/v1';

import { nodeAffinityValues } from '@/kubernetes/filters/application';
import { useAuthorizations } from '@/react/hooks/useUser';

import { Affinity, Label, NodePlacementRowData } from '../types';

interface SubRowProps {
  node: NodePlacementRowData;
  cellCount: number;
}

export function SubRow({ node, cellCount }: SubRowProps) {
  const { authorized } = useAuthorizations(
    'K8sApplicationErrorDetailsR',
    undefined,
    true
  );

  if (!authorized) {
    <>
      {isDefined(node.unmetTaints) && (
        <tr
          className={clsx({
            'datatable-highlighted': node.highlighted,
            'datatable-unhighlighted': !node.highlighted,
          })}
        >
          <td colSpan={cellCount}>
            该节点不满足调度约束。
          </td>
        </tr>
      )}

      {(isDefined(node.unmatchedNodeSelectorLabels) ||
        isDefined(node.unmatchedNodeAffinities)) && (
        <tr
          className={clsx({
            'datatable-highlighted': node.highlighted,
            'datatable-unhighlighted': !node.highlighted,
          })}
        >
          <td colSpan={cellCount}>
            该节点不满足调度标签要求。
          </td>
        </tr>
      )}
    </>;
  }

  return (
    <>
      {isDefined(node.unmetTaints) && (
        <UnmetTaintsInfo
          taints={node.unmetTaints}
          cellCount={cellCount}
          isHighlighted={node.highlighted}
        />
      )}
      {isDefined(node.unmatchedNodeSelectorLabels) && (
        <UnmatchedLabelsInfo
          labels={node.unmatchedNodeSelectorLabels}
          cellCount={cellCount}
          isHighlighted={node.highlighted}
        />
      )}
      {isDefined(node.unmatchedNodeAffinities) && (
        <UnmatchedAffinitiesInfo
          affinities={node.unmatchedNodeAffinities}
          cellCount={cellCount}
          isHighlighted={node.highlighted}
        />
      )}
    </>
  );
}

function isDefined<T>(arr?: Array<T>): arr is Array<T> {
  return !!arr && arr.length > 0;
}

function UnmetTaintsInfo({
  taints,
  isHighlighted,
  cellCount,
}: {
  taints: Array<Taint>;
  isHighlighted: boolean;
  cellCount: number;
}) {
  return (
    <>
      {taints.map((taint) => (
        <tr
          className={clsx({
            'datatable-highlighted': isHighlighted,
            'datatable-unhighlighted': !isHighlighted,
          })}
          key={taint.key}
        >
          <td colSpan={cellCount}>
            此应用缺少对污点
            <code className="space-left">
              {taint.key}
              {taint.value ? `=${taint.value}` : ''}:{taint.effect}
            </code>
          </td>
        </tr>
      ))}
    </>
  );
}

function UnmatchedLabelsInfo({
  labels,
  isHighlighted,
  cellCount,
}: {
  labels: Array<Label>;
  isHighlighted: boolean;
  cellCount: number;
}) {
  return (
    <>
      {labels.map((label) => (
        <tr
          className={clsx({
            'datatable-highlighted': isHighlighted,
            'datatable-unhighlighted': !isHighlighted,
          })}
          key={label.key}
        >
          <td colSpan={cellCount}>
            此应用只能调度到标签{' '}
            <code>{label.key}</code>设置为<code>{label.value}</code>的节点上
          </td>
        </tr>
      ))}
    </>
  );
}

function UnmatchedAffinitiesInfo({
  affinities,
  isHighlighted,
  cellCount,
}: {
  affinities: Array<Affinity>;
  isHighlighted: boolean;
  cellCount: number;
}) {
  return (
    <>
      <tr
        className={clsx({
          'datatable-highlighted': isHighlighted,
          'datatable-unhighlighted': !isHighlighted,
        })}
      >
        <td colSpan={cellCount}>
          此应用只能调度到满足以下任一标签组合的节点上：
        </td>
      </tr>
      {affinities.map((aff) => (
        <tr
          className={clsx({
            'datatable-highlighted': isHighlighted,
            'datatable-unhighlighted': !isHighlighted,
          })}
          key={aff.map((term) => term.key).join('')}
        >
          <td />
          <td colSpan={cellCount - 1}>
            {aff.map((term, index) => (
              <Fragment key={index}>
                <code>
                  {term.key} {term.operator}{' '}
                  {nodeAffinityValues(term.values, term.operator)}
                </code>
                <span>{index === aff.length - 1 ? '' : ' + '}</span>
              </Fragment>
            ))}
          </td>
        </tr>
      ))}
    </>
  );
}
