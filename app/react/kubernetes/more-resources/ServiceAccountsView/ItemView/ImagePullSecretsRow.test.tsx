import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { ReactNode } from 'react';
import { vi } from 'vitest';

import { server } from '@/setup-tests/server';
import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';
import { useAuthorizations } from '@/react/hooks/useUser';

import { ImagePullSecretsRow } from './ImagePullSecretsRow';

vi.mock('@/react/hooks/useEnvironmentId', () => ({
  useEnvironmentId: () => 1,
}));

vi.mock(
  '@/react/hooks/useUser',
  async (importOriginal: () => Promise<object>) => ({
    ...(await importOriginal()),
    useAuthorizations: vi.fn(),
    useCurrentUser: () => ({ isPureAdmin: false }),
  })
);

vi.mock('@/react/kubernetes/configs/queries/useSecrets', () => ({
  useSecrets: () => ({
    data: [
      { metadata: { name: 'secret-a' } },
      { metadata: { name: 'secret-b' } },
    ],
    isLoading: false,
  }),
}));

vi.mock(
  '@/react/portainer/environments/queries/useEnvironmentRegistries',
  () => ({
    useEnvironmentRegistries: () => ({
      data: {
        linkedDefaultSecretNames: [],
        registryBySecretName: {},
      },
      isLoading: false,
    }),
  })
);

vi.mock('@@/Link', () => ({
  Link: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@@/Tip/Tooltip', () => ({ Tooltip: () => null }));

vi.mock('@@/Tip/TooltipWithChildren', () => ({
  TooltipWithChildren: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@@/form-components/PortainerSelect', () => ({
  MultiSelect: () => <div data-testid="multi-select" />,
}));

const ImagePullSecretsRowWithQuery = withTestQueryProvider(ImagePullSecretsRow);

type RowProps = React.ComponentProps<typeof ImagePullSecretsRow>;

function renderRow(props: Partial<RowProps> = {}) {
  return render(
    <ImagePullSecretsRowWithQuery
      namespace="default"
      name="my-sa"
      imagePullSecrets={[]}
      isSystem={false}
      {...props}
    />
  );
}

describe('ImagePullSecretsRow', () => {
  beforeEach(() => {
    vi.mocked(useAuthorizations).mockImplementation(() => ({
      authorized: false,
      isLoading: false,
    }));
  });

  describe('empty state messages', () => {
    it('shows a pod-specific message for a non-default service account', () => {
      renderRow({ name: 'my-sa', imagePullSecrets: [] });
      expect(
        screen.getByText(/使用此 ServiceAccount 的 Pod 必须手动设置/)
      ).toBeVisible();
    });

    it('shows a namespace-wide message for the default service account', () => {
      renderRow({ name: 'default', imagePullSecrets: [] });
      expect(
        screen.getByText(
          /此命名空间中未显式指定 ServiceAccount 的 Pod/
        )
      ).toBeVisible();
    });
  });

  describe('pull secret badges', () => {
    it('renders current pull secrets as badges', () => {
      renderRow({
        imagePullSecrets: [{ name: 'secret-a' }, { name: 'secret-b' }],
      });
      expect(screen.getByText('secret-a')).toBeVisible();
      expect(screen.getByText('secret-b')).toBeVisible();
    });

    it('shows a warning badge for a pull secret that no longer exists in the namespace', () => {
      renderRow({ imagePullSecrets: [{ name: 'orphan-secret' }] });
      expect(screen.getByText('orphan-secret')).toBeVisible();
    });
  });

  describe('edit button visibility by role', () => {
    it('does not show edit button for a user without write permission', () => {
      vi.mocked(useAuthorizations).mockImplementation(() => ({
        authorized: false,
        isLoading: false,
      }));
      renderRow();
      expect(
        screen.queryByRole('button', { name: '编辑' })
      ).not.toBeInTheDocument();
    });

    it('does not show edit button for system service accounts, even for an admin', () => {
      vi.mocked(useAuthorizations).mockImplementation(() => ({
        authorized: true,
        isLoading: false,
      }));
      renderRow({ isSystem: true });
      expect(
        screen.queryByRole('button', { name: '编辑' })
      ).not.toBeInTheDocument();
    });

    it('shows edit button for an authorized user on a non-system SA', () => {
      vi.mocked(useAuthorizations).mockImplementation((permission) => ({
        authorized: permission === 'K8sServiceAccountsW',
        isLoading: false,
      }));
      renderRow({ isSystem: false });
      expect(screen.getByRole('button', { name: '编辑' })).toBeVisible();
    });
  });

  describe('edit flow', () => {
    beforeEach(() => {
      vi.mocked(useAuthorizations).mockImplementation((permission) => ({
        authorized: permission === 'K8sServiceAccountsW',
        isLoading: false,
      }));
    });

    it('shows save and cancel buttons after clicking edit', async () => {
      renderRow({ imagePullSecrets: [{ name: 'secret-a' }] });

      await userEvent.click(screen.getByRole('button', { name: '编辑' }));

      expect(screen.getByRole('button', { name: '保存' })).toBeVisible();
      expect(screen.getByRole('button', { name: '取消' })).toBeVisible();
    });

    it('returns to view mode when cancel is clicked', async () => {
      renderRow({ imagePullSecrets: [{ name: 'secret-a' }] });

      await userEvent.click(screen.getByRole('button', { name: '编辑' }));
      await userEvent.click(screen.getByRole('button', { name: '取消' }));

      expect(screen.getByRole('button', { name: '编辑' })).toBeVisible();
      expect(
        screen.queryByRole('button', { name: '保存' })
      ).not.toBeInTheDocument();
    });

    it('sends a PUT to the correct path and body when save is clicked', async () => {
      let capturedPath: string | undefined;
      let capturedBody: unknown;

      server.use(
        http.put(
          '/api/kubernetes/:envId/namespaces/:namespace/service_accounts/:name/image_pull_secrets',
          async ({ request }) => {
            capturedPath = request.url;
            capturedBody = await request.json();
            return new HttpResponse(null, { status: 204 });
          }
        )
      );

      renderRow({
        namespace: 'production',
        name: 'app-sa',
        imagePullSecrets: [{ name: 'secret-a' }, { name: 'secret-b' }],
      });

      await userEvent.click(screen.getByRole('button', { name: '编辑' }));
      await userEvent.click(screen.getByRole('button', { name: '保存' }));

      await waitFor(() => {
        expect(capturedPath).toContain(
          '/api/kubernetes/1/namespaces/production/service_accounts/app-sa/image_pull_secrets'
        );
        expect(capturedBody).toEqual({
          secretNames: ['secret-a', 'secret-b'],
        });
      });
    });

    it('sends an empty secretNames array when there are no pull secrets', async () => {
      let capturedBody: unknown;

      server.use(
        http.put(
          '/api/kubernetes/:envId/namespaces/:namespace/service_accounts/:name/image_pull_secrets',
          async ({ request }) => {
            capturedBody = await request.json();
            return new HttpResponse(null, { status: 204 });
          }
        )
      );

      renderRow({ namespace: 'default', name: 'my-sa', imagePullSecrets: [] });

      await userEvent.click(screen.getByRole('button', { name: '编辑' }));
      await userEvent.click(screen.getByRole('button', { name: '保存' }));

      await waitFor(() => {
        expect(capturedBody).toEqual({ secretNames: [] });
      });
    });
  });

  describe('admin vs standard user role', () => {
    it('admin with registry access can enter edit mode', async () => {
      vi.mocked(useAuthorizations).mockImplementation(() => ({
        authorized: true,
        isLoading: false,
      }));
      renderRow({ isSystem: false });
      await userEvent.click(screen.getByRole('button', { name: '编辑' }));
      expect(screen.getByRole('button', { name: '保存' })).toBeVisible();
    });

    it('standard user with write permission but no registry access can also enter edit mode', async () => {
      vi.mocked(useAuthorizations).mockImplementation((permission) => ({
        authorized: permission === 'K8sServiceAccountsW',
        isLoading: false,
      }));
      renderRow({ isSystem: false });
      await userEvent.click(screen.getByRole('button', { name: '编辑' }));
      expect(screen.getByRole('button', { name: '保存' })).toBeVisible();
    });
  });
});
