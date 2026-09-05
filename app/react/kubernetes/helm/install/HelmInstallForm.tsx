import { useRef, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { useRouter } from '@uirouter/react';

import { notifySuccess } from '@/portainer/services/notifications';
import { useCanExit } from '@/react/hooks/useCanExit';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { confirm, confirmGenericDiscard } from '@@/modals/confirm';
import { Option } from '@@/form-components/PortainerSelect';

import { Chart } from '../types';
import { useUpdateHelmReleaseMutation } from '../helmReleaseQueries/useUpdateHelmReleaseMutation';
import {
  ChartVersion,
  useHelmRepoVersions,
} from '../helmChartSourceQueries/useHelmRepoVersions';

import { HelmInstallInnerForm } from './HelmInstallInnerForm';
import { HelmInstallFormValues } from './types';

type Props = {
  selectedChart: Chart;
  namespace?: string;
  name?: string;
  isRepoAvailable: boolean;
};

export function HelmInstallForm({
  selectedChart,
  namespace,
  name,
  isRepoAvailable,
}: Props) {
  const environmentId = useEnvironmentId();
  const [previewIsValid, setPreviewIsValid] = useState(false);
  const router = useRouter();
  const helmRepoVersionsQuery = useHelmRepoVersions(
    selectedChart.name,
    60 * 60 * 1000, // 1 hour
    [
      {
        repo: selectedChart.repo,
      },
    ]
  );
  const versions = helmRepoVersionsQuery.data;
  const versionOptions: Option<ChartVersion>[] = versions.map(
    (version, index) => ({
      label: index === 0 ? `${version.Version}（最新）` : version.Version,
      value: version,
    })
  );
  const defaultVersion = versionOptions[0]?.value;
  const initialValues: HelmInstallFormValues = {
    values: '',
    version: defaultVersion?.Version ?? '',
    repo: defaultVersion?.Repo ?? selectedChart.repo ?? '',
  };

  const installHelmChartMutation = useUpdateHelmReleaseMutation(environmentId);

  const formikRef = useRef<FormikProps<HelmInstallFormValues>>(null);
  useCanExit(() => !formikRef.current?.dirty || confirmGenericDiscard());

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      <HelmInstallInnerForm
        selectedChart={selectedChart}
        namespace={namespace}
        name={name}
        versionOptions={versionOptions}
        isVersionsLoading={helmRepoVersionsQuery.isInitialLoading}
        isRepoAvailable={isRepoAvailable}
        setPreviewIsValid={setPreviewIsValid}
      />
    </Formik>
  );

  async function handleSubmit(values: HelmInstallFormValues) {
    if (!name || !namespace) {
      // Theoretically this should never happen and is mainly to keep typescript happy
      return;
    }

    if (!previewIsValid) {
      const confirmed = await confirm({
        title: 'Chart 校验失败',
        message:
          'Helm Manifest 预览校验失败，这可能表示存在配置问题。在创建新资源时这也可能是正常现象。是否继续安装？',
      });
      if (!confirmed) {
        return;
      }
    }

    await installHelmChartMutation.mutateAsync(
      {
        name,
        repo: selectedChart.repo,
        chart: selectedChart.name,
        values: values.values,
        namespace,
        version: values.version,
      },
      {
        onSuccess() {
          notifySuccess('成功', 'Helm Chart 安装成功');

          // Reset the form so page can be navigated away from without getting "Are you sure?"
          formikRef.current?.resetForm();
          router.stateService.go('kubernetes.applications');
        },
      }
    );
  }
}
