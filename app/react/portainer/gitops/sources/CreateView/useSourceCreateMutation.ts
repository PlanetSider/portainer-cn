import { useMutation, useQueryClient } from '@tanstack/react-query';

import { gitOpsSourcesCreateGit } from '@api/sdk.gen';
import { type SourcesGitSourceCreatePayload } from '@api/types.gen';

import { withError, withInvalidate } from '@/react-tools/react-query';

import { sourceQueryKeys } from '../queries/query-keys';

export type CreateSourcePayload = {
  type: 'git' | 'registry' | 'helm';
  git: SourcesGitSourceCreatePayload;
};

export function useCreateSourceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSource,
    ...withError('无法创建来源'),
    ...withInvalidate(queryClient, [sourceQueryKeys.all]),
  });
}

async function createSource(payload: CreateSourcePayload) {
  const { data } = await gitOpsSourcesCreateGit({ body: payload.git });
  return data;
}
