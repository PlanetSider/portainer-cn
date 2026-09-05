import { AutomationTestingProps } from '@/types';

import { DiffViewer } from '@@/CodeEditor/DiffViewer';
import { Loading } from '@@/Widget';
import { Alert } from '@@/Alert';

import { CompareRevisionNumberFetched, SelectedRevisionNumber } from './types';

interface Props extends AutomationTestingProps {
  isCompareReleaseLoading: boolean;
  isCompareReleaseError: boolean;
  compareRevisionNumberFetched?: CompareRevisionNumberFetched;
  selectedRevisionNumber: SelectedRevisionNumber;
  newText: string;
  originalText: string;
  id: string;
}

export function DiffViewSection({
  isCompareReleaseLoading,
  isCompareReleaseError,
  compareRevisionNumberFetched,
  selectedRevisionNumber,
  newText,
  originalText,
  id,
  'data-cy': dataCy,
}: Props) {
  if (isCompareReleaseLoading) {
    return <Loading />;
  }

  if (isCompareReleaseError) {
    return <Alert color="error">加载对比值失败</Alert>;
  }

  return (
    <DiffViewer
      newCode={newText}
      originalCode={originalText}
      id={id}
      data-cy={dataCy}
      placeholder="未找到值"
      fileNames={{
        original: compareRevisionNumberFetched
          ? `修订版本 #${compareRevisionNumberFetched}`
          : '未选择修订版本',
        modified: `修订版本 #${selectedRevisionNumber}`,
      }}
      className="mt-2"
      type="yaml"
      height="60vh"
    />
  );
}
