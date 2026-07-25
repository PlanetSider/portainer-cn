import { isAxiosError } from '@/portainer/services/axios/utils/isAxiosError';

import { isDefaultResponse } from '../../services/axios/utils/parseAxiosError';
import { useGitRefs } from '../queries/useGitRefs';

interface Params {
  force?: boolean;
  sourceId?: number;
  enabled?: boolean;
  onSettled?(isValid?: boolean): void;
  onAfterSettle?(): void;
}

export function useGitRepoValidity({
  sourceId,
  force,
  enabled,
  onSettled,
  onAfterSettle,
}: Params) {
  const query = useGitRefs(
    {
      sourceId: sourceId!,
      force,
    },
    {
      enabled: !!sourceId && enabled,
      select: () => true,
      suppressError: true,
      onSettled(isValid) {
        if (onSettled) {
          onSettled(isValid);
        }
        if (onAfterSettle) {
          onAfterSettle();
        }
      },
    }
  );

  const errorMessage = getGitValidityError(query.error, !!sourceId);

  const isChecking = query.isInitialLoading || query.isFetching;

  return {
    isValid: !!query.data && !query.isError,
    isChecking,
    hasError: query.isError,
    errorMessage,
    query,
  } as const;
}

export function getGitValidityError(error: unknown, hasCreds: boolean) {
  if (!isAxiosError(error)) return undefined;
  const responseData = error.response?.data;
  const details = isDefaultResponse(responseData)
    ? (responseData.details ?? '')
    : '';
  if (
    !hasCreds &&
    details === 'Authentication required: Repository not found.'
  ) {
    return '找不到 Git Repository 或该 Repository 为私有，请确认 URL 正确或已提供凭据。';
  }
  return details || undefined;
}
