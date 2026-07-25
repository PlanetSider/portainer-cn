import { render, screen, waitFor } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';
import { server, http } from '@/setup-tests/server';
import { withTestRouter } from '@/react/test-utils/withRouter';

import { RepoConfigResponse } from './types';
import { GitReferenceCard } from './GitReferenceCard';

vi.mock('@/portainer/helpers/webhookHelper', () => ({
  baseStackWebhookUrl: () => 'https://portainer.example/api/stacks/webhooks',
}));

const defaultGitConfig: RepoConfigResponse = {
  URL: 'https://github.com/portainer/portainer-compose',
  ReferenceName: 'refs/heads/main',
  ConfigFilePath: 'docker-compose.yml',
  ConfigHash: 'abc123def456',
  TLSSkipVerify: false,
};

function renderCard(
  overrides: Partial<Parameters<typeof GitReferenceCard>[0]> = {}
) {
  const Component = withTestQueryProvider(
    withTestRouter(() => (
      <GitReferenceCard
        gitConfig={defaultGitConfig}
        stackType="docker"
        sourceId={1}
        {...overrides}
      />
    ))
  );
  return render(<Component />);
}

describe('GitReferenceCard', () => {
  beforeEach(() => {
    server.use(
      http.post('/api/gitops/repo/refs', () =>
        HttpResponse.json(['refs/heads/main', 'refs/heads/develop'])
      ),
      http.post('/api/gitops/repo/files/search', () =>
        HttpResponse.json(['docker-compose.yml'])
      )
    );
  });

  describe('Normal state (no divergence)', () => {
    it('renders repo, ref, and file info from gitConfig', async () => {
      renderCard();

      await waitFor(() =>
        expect(screen.getByRole('group', { name: '仓库' })).toHaveTextContent(
          defaultGitConfig.URL
        )
      );
      expect(screen.getByRole('group', { name: '引用' })).toHaveTextContent(
        defaultGitConfig.ReferenceName
      );
      expect(screen.getByRole('group', { name: '文件' })).toHaveTextContent(
        defaultGitConfig.ConfigFilePath
      );
    });

    it('does not show divergence alert when currentDeploymentInfo matches gitConfig', async () => {
      renderCard({
        currentDeploymentInfo: {
          Version: 1,
          FileVersion: 1,
          RepositoryURL: defaultGitConfig.URL,
          ReferenceName: defaultGitConfig.ReferenceName,
          ConfigFilePath: defaultGitConfig.ConfigFilePath,
        },
      });

      await waitFor(() =>
        expect(screen.getByRole('group', { name: '仓库' })).toHaveTextContent(
          defaultGitConfig.URL
        )
      );
      expect(
        screen.queryByText('自上次部署以来设置已发生变化')
      ).not.toBeInTheDocument();
    });

    it('shows auto-update as Off when not set', () => {
      renderCard();
      expect(
        screen.getByRole('group', { name: '自动更新' })
      ).toHaveTextContent('关闭');
    });

    it('shows auto-update as On when autoUpdate is provided', async () => {
      renderCard({
        autoUpdate: {
          Interval: '5m',
          Webhook: '',
          ForcePullImage: false,
          ForceUpdate: false,
        },
      });

      expect(
        screen.getByRole('group', { name: '自动更新' })
      ).toHaveTextContent('开启');
      expect(screen.getByRole('group', { name: '间隔' })).toHaveTextContent(
        '5m'
      );
    });
  });

  describe('Diverged state', () => {
    it('shows divergence alert with next URL when URL changed', async () => {
      renderCard({
        currentDeploymentInfo: {
          Version: 1,
          FileVersion: 1,
          RepositoryURL: 'https://github.com/portainer/old-repo',
          ReferenceName: defaultGitConfig.ReferenceName,
          ConfigFilePath: defaultGitConfig.ConfigFilePath,
        },
      });

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(
          '自上次部署以来设置已发生变化'
        )
      );
      expect(screen.getByRole('status')).toHaveTextContent(
        defaultGitConfig.URL
      );
    });

    it('shows divergence alert when ReferenceName changed', async () => {
      renderCard({
        currentDeploymentInfo: {
          Version: 1,
          FileVersion: 1,
          RepositoryURL: defaultGitConfig.URL,
          ReferenceName: 'refs/heads/old-branch',
          ConfigFilePath: defaultGitConfig.ConfigFilePath,
        },
      });

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(
          '自上次部署以来设置已发生变化'
        )
      );
      expect(screen.getByRole('status')).toHaveTextContent(
        defaultGitConfig.ReferenceName
      );
    });

    it('shows deployed values in line items when diverged', async () => {
      const deployedUrl = 'https://github.com/portainer/old-repo';
      renderCard({
        currentDeploymentInfo: {
          Version: 1,
          FileVersion: 1,
          RepositoryURL: deployedUrl,
          ReferenceName: defaultGitConfig.ReferenceName,
          ConfigFilePath: defaultGitConfig.ConfigFilePath,
        },
      });

      await waitFor(() =>
        expect(screen.getByRole('group', { name: '仓库' })).toHaveTextContent(
          deployedUrl
        )
      );
    });

    it('always shows the next config file path in the divergence alert', async () => {
      renderCard({
        currentDeploymentInfo: {
          Version: 1,
          FileVersion: 1,
          RepositoryURL: 'https://github.com/portainer/old-repo',
          ReferenceName: defaultGitConfig.ReferenceName,
          ConfigFilePath: defaultGitConfig.ConfigFilePath,
        },
      });

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(
          '自上次部署以来设置已发生变化'
        )
      );
      expect(screen.getByRole('status')).toHaveTextContent(
        defaultGitConfig.ConfigFilePath
      );
    });

    it('does not show divergence alert when currentDeploymentInfo is null', async () => {
      renderCard({ currentDeploymentInfo: null });

      await waitFor(() =>
        expect(screen.getByRole('group', { name: '仓库' })).toHaveTextContent(
          defaultGitConfig.URL
        )
      );
      expect(
        screen.queryByText('自上次部署以来设置已发生变化')
      ).not.toBeInTheDocument();
    });
  });
});
