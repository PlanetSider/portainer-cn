import { Eye } from 'lucide-react';

import { Icon } from '@@/Icon';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '@@/Sheet';

import { HelmRelease } from '../types';

import { HelmRevisionList } from './HelmRevisionList';

export function HelmRevisionListSheet({
  currentRevision,
  history,
}: {
  currentRevision: number | undefined;
  history: HelmRelease[] | undefined;
}) {
  return (
    <Sheet>
      <SheetTrigger className="btn btn-link">
        <Icon icon={Eye} />
        查看修订版本
      </SheetTrigger>
      <SheetContent className="!w-80 overflow-auto !p-0 !pt-1">
        <div className="sr-only">
          <SheetHeader title="修订版本" />
          <SheetDescription>
            查看此 Helm 应用的历史记录。
          </SheetDescription>
        </div>
        <HelmRevisionList currentRevision={currentRevision} history={history} />
      </SheetContent>
    </Sheet>
  );
}
