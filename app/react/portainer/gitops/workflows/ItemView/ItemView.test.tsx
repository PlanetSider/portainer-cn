import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ReactNode } from 'react';
import { HttpResponse } from 'msw';

import { http, server } from '@/setup-tests/server';
import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';
import { withTestRouter } from '@/react/test-utils/withRouter';
import { withUserProvider } from '@/react/test-utils/withUserProvider';
import { UserViewModel } from '@/portainer/models/user';

import { Workflow } from '../types';
import {
  mockWorkflowHealthy,
  mockWorkflowEmpty,
} from '../test-utils/workflow.mock';

import { ItemView } from './ItemView';

const useCurrentStateAndParams = vi.fn(() => ({
  params: { workflowId: 1 },
}));
const go = vi.fn();

vi.mock('@uirouter/react', async (importOriginal: () => Promise<object>) => ({
  ...(await importOriginal()),
  useCurrentStateAndParams: () => useCurrentStateAndParams(),
  useRouter: () => ({ stateService: { go } }),
}));

// Avoid ui-router relative/unregistered state resolution in tests, same as WidgetTabs.test.tsx
vi.mock('@@/Link', () => ({
  Link: ({
    children,
    'data-cy': dataCy,
    className,
  }: {
    children: ReactNode;
    'data-cy'?: string;
    className?: string;
  }) => (
    <a data-cy={dataCy} className={className} href="/">
      {children}
    </a>
  ),
}));

describe('ItemView', () => {
  it('renders the workflow name and status badge once loaded', async () => {
    renderComponent();

    expect(
      await screen.findByRole('heading', { name: mockWorkflowHealthy.name })
    ).toBeInTheDocument();
    expect(screen.getByText('正常')).toBeInTheDocument();
  });

  it('renders the Overview tab sections with the fixture artifact', async () => {
    renderComponent();

    await screen.findByRole('heading', { name: mockWorkflowHealthy.name });

    expect(screen.getByText('堆栈')).toBeInTheDocument();
    expect(screen.getAllByText('目标').length).toBeGreaterThan(0);
    expect(screen.getByText('文件')).toBeInTheDocument();
    expect(screen.getByText('来源')).toBeInTheDocument();
    expect(
      (await screen.findAllByText('docker-compose.yml')).length
    ).toBeGreaterThan(0);
  });

  it('renders the empty state for a zero-artifact workflow', async () => {
    renderComponent(mockWorkflowEmpty);

    expect(
      await screen.findByRole('heading', { name: mockWorkflowEmpty.name })
    ).toBeInTheDocument();
    expect(screen.getAllByText('无工件').length).toBeGreaterThan(0);
    expect(screen.queryByText('堆栈')).not.toBeInTheDocument();
  });
});

function renderComponent(workflow: Workflow = mockWorkflowHealthy) {
  go.mockClear();
  useCurrentStateAndParams.mockReturnValue({
    params: { workflowId: workflow.id },
  });

  server.use(
    http.get(`/api/gitops/workflows/${workflow.id}`, () =>
      HttpResponse.json(workflow)
    )
  );

  const user = new UserViewModel({ Username: 'user', Role: 1 });

  const Wrapped = withTestQueryProvider(
    withUserProvider(withTestRouter(ItemView), user)
  );

  return render(<Wrapped />);
}
