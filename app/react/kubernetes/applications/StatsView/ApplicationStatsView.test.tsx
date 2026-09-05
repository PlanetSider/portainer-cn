import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/setup-tests/server';
import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';
import { withUserProvider } from '@/react/test-utils/withUserProvider';
import { withTestRouter } from '@/react/test-utils/withRouter';

import { ApplicationStatsView } from './ApplicationStatsView';

vi.mock('@uirouter/react', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useCurrentStateAndParams: vi.fn(() => ({
    params: {
      endpointId: 1,
      namespace: 'default',
      name: 'my-app',
      pod: 'my-pod',
      container: 'my-container',
    },
  })),
}));

vi.mock('recharts');

const podMetricsSuccess = {
  timestamp: '2024-01-01T00:00:00Z',
  containers: [
    {
      name: 'my-container',
      usage: { cpu: '100m', memory: '128Mi' },
    },
  ],
};

function addBaseHandlers() {
  server.use(
    http.get(
      '/api/endpoints/1/kubernetes/api/v1/namespaces/default/pods/my-pod',
      () => HttpResponse.json({ spec: { nodeName: 'node1' } })
    ),
    http.get('/api/endpoints/1/kubernetes/api/v1/nodes/node1', () =>
      HttpResponse.json({ status: { allocatable: { cpu: '4' } } })
    ),
    http.get('/api/kubernetes/1/metrics/pods/namespace/default/my-pod', () =>
      HttpResponse.json(podMetricsSuccess)
    )
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  addBaseHandlers();
});

afterEach(() => {
  vi.useRealTimers();
});

function renderComponent() {
  const Wrapped = withTestQueryProvider(
    withUserProvider(withTestRouter(ApplicationStatsView))
  );
  return render(<Wrapped />);
}

describe('ApplicationStatsView', () => {
  it('renders the page header "应用统计信息"', async () => {
    server.use(
      http.get('/api/kubernetes/1/metrics/pods/namespace/default/my-pod', () =>
        HttpResponse.json(podMetricsSuccess)
      )
    );

    renderComponent();

    expect(screen.getByText('应用统计信息')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole('combobox', { name: '刷新频率' })
      ).toBeInTheDocument();
    });
  });

  it('shows "无法获取容器指标" panel when pod metrics fetch returns 500', async () => {
    server.use(
      http.get('/api/kubernetes/1/metrics/pods/namespace/default/my-pod', () =>
        HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
      )
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('无法获取容器指标')
      ).toBeInTheDocument();
    });
  });

  it('shows the refresh rate select when metrics are available', async () => {
    server.use(
      http.get('/api/kubernetes/1/metrics/pods/namespace/default/my-pod', () =>
        HttpResponse.json(podMetricsSuccess)
      )
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole('combobox', { name: '刷新频率' })
      ).toBeInTheDocument();
    });
  });

  it('does not show the unavailable panel when metrics fetch succeeds', async () => {
    server.use(
      http.get('/api/kubernetes/1/metrics/pods/namespace/default/my-pod', () =>
        HttpResponse.json(podMetricsSuccess)
      )
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole('combobox', { name: '刷新频率' })
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText('无法获取容器指标')
    ).not.toBeInTheDocument();
  });
});
