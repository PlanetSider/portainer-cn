import { Node } from 'kubernetes-types/core/v1';
import { Form, Formik, useFormikContext } from 'formik';
import { useRouter } from '@uirouter/react';

import { KubernetesEndpoint } from '@/kubernetes/endpoint/models';
import { useAuthorizations } from '@/react/hooks/useUser';
import { notifySuccess } from '@/portainer/services/notifications';
import { useApplications } from '@/react/kubernetes/applications/queries/useApplications';

import { Loading } from '@@/Widget';
import { Alert } from '@@/Alert';
import { FormActions } from '@@/form-components/FormActions';
import { Button } from '@@/buttons';
import { isArrayErrorType } from '@@/form-components/formikUtils';

import { useNodeQuery } from '../../queries/useNodeQuery';
import { useKubernetesEndpointsQuery } from '../../kubernetesEndpoint.service';
import { getAvailability } from '../../nodeUtils';
import { confirmUpdateNode } from '../ConfirmUpdateNode';
import { useUpdateNodeMutation } from '../../queries/useUpdateNodeMutation';
import { useDrainNodeMutation } from '../../queries/useDrainNodeMutation';
import { useNodesQuery } from '../../queries/useNodesQuery';

import { NodeLabels } from './NodeLabels';
import { NodeSummary } from './NodeSummary';
import { NodeTaints } from './NodeTaints';
import { NodeResourceReservation } from './NodeResourceReservation';
import { NodeFormValues } from './types';
import { createLabel, createTaint } from './nodeFormUtils';
import { createValidationSchema } from './validation';

type Props = {
  nodeName: string;
  environmentId: number;
};

export function NodeDetails({ nodeName, environmentId }: Props) {
  const router = useRouter();
  const nodeQuery = useNodeQuery(environmentId, nodeName);
  const nodesAvailabilityQuery = useNodesQuery(environmentId, {
    select: (nodes) => nodes.map(getAvailability),
  });
  const applicationsQuery = useApplications(environmentId, {
    nodeName,
  });
  const applications = applicationsQuery.data ?? [];
  const endpointsQuery = useKubernetesEndpointsQuery(environmentId);
  const updateNodeMutation = useUpdateNodeMutation(environmentId, nodeName);
  const drainNodeMutation = useDrainNodeMutation(environmentId, nodeName);

  if (nodeQuery.isInitialLoading || endpointsQuery.isInitialLoading) {
    return <Loading />;
  }

  if (nodeQuery.isError) {
    return <Alert color="error">加载节点详情时出错</Alert>;
  }
  if (applicationsQuery.isError) {
    return <Alert color="error">加载应用时出错</Alert>;
  }
  if (nodesAvailabilityQuery.isError) {
    return <Alert color="error">加载节点可用性时出错</Alert>;
  }
  // continue even if endpointsQuery is error, because it's not critical for the node details page

  if (!nodeQuery.data) {
    return <Alert color="error">未找到节点</Alert>;
  }

  const nodeFormValues = getNodeFormValues(nodeQuery.data);
  const isOnlyNode = nodesAvailabilityQuery.data?.length === 1;
  const containsPortainer = applications.some(
    (app) => app.Name === 'portainer'
  );
  const hasDrainOperation = !!nodesAvailabilityQuery.data?.some(
    (availability) => availability === 'Drain'
  );
  return (
    <Formik
      initialValues={nodeFormValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={createValidationSchema(
        isOnlyNode,
        hasDrainOperation,
        containsPortainer
      )}
    >
      <NodeDetailsForm
        node={nodeQuery.data}
        endpoints={endpointsQuery.data ?? []}
        nodeName={nodeName}
        environmentId={environmentId}
      />
    </Formik>
  );

  async function handleSubmit(values: NodeFormValues) {
    const node = nodeQuery.data;
    if (!node) {
      return;
    }

    // gather warnings
    const taintsWarning = values.taints.some(
      (taint) => taint.isChanged || taint.isNew || taint.needsDeletion
    );
    const labelsWarning = values.labels.some(
      (label) => label.isChanged || label.isNew || label.needsDeletion
    );
    const cordonWarning = values.availability === 'Pause';
    const drainWarning = values.availability === 'Drain';

    // if there are warnings, confirm the update
    if (taintsWarning || labelsWarning || cordonWarning || drainWarning) {
      const confirmed = await confirmUpdateNode(
        taintsWarning,
        labelsWarning,
        cordonWarning,
        drainWarning
      );
      if (!confirmed) {
        return;
      }
    }

    // errors are handled in the useQuery mutations
    await updateNodeMutation.mutateAsync({
      formValues: values,
      node,
    });
    if (values.availability === 'Drain') {
      await drainNodeMutation.mutateAsync();
    }
    notifySuccess('成功', '节点更新成功');

    router.stateService.reload();
  }
}

function NodeDetailsForm({
  node,
  endpoints,
  nodeName,
  environmentId,
}: {
  node: Node;
  endpoints: KubernetesEndpoint[];
  nodeName: string;
  environmentId: number;
}) {
  const {
    isSubmitting,
    isValid,
    resetForm,
    dirty,
    values,
    setFieldValue,
    errors,
  } = useFormikContext<NodeFormValues>();
  const { authorized: hasNodeWriteAccess } =
    useAuthorizations('K8sClusterNodeW');
  const labelErrors = isArrayErrorType(errors.labels)
    ? errors.labels
    : undefined;
  const taintErrors = isArrayErrorType(errors.taints)
    ? errors.taints
    : undefined;

  return (
    <Form className="form-horizontal">
      <NodeSummary
        node={node}
        endpoints={endpoints}
        availability={values.availability}
        error={errors.availability}
        onChangeAvailability={(availability) => {
          setFieldValue('availability', availability);
        }}
        hasNodeWriteAccess={hasNodeWriteAccess}
      />
      <NodeResourceReservation
        nodeName={nodeName}
        environmentId={environmentId}
        node={node}
      />
      <NodeLabels
        labels={values.labels}
        onChangeLabels={(labels) => setFieldValue('labels', labels)}
        errors={labelErrors ?? []}
        hasNodeWriteAccess={hasNodeWriteAccess}
      />
      <NodeTaints
        taints={values.taints}
        onChangeTaints={(taints) => setFieldValue('taints', taints)}
        errors={taintErrors ?? []}
        hasNodeWriteAccess={hasNodeWriteAccess}
      />
      {hasNodeWriteAccess && (
        <FormActions
          submitLabel="更新节点"
          loadingText="正在更新节点..."
          isLoading={isSubmitting}
          isValid={isValid && !isSubmitting}
          data-cy="node-saveButton"
        >
          <Button
            color="default"
            disabled={isSubmitting || !dirty}
            onClick={() => resetForm()}
            data-cy="node-update-cancel"
          >
            取消
          </Button>
        </FormActions>
      )}
    </Form>
  );
}

function getNodeFormValues(node: Node): NodeFormValues {
  const availability = getAvailability(node);
  const labels = Object.entries(node.metadata?.labels ?? {})
    .map(createLabel)
    .sort((a, b) => a.key.localeCompare(b.key))
    .sort((a, b) => {
      if (a.isSystem && !b.isSystem) {
        return -1;
      }
      if (!a.isSystem && b.isSystem) {
        return 1;
      }
      return 0;
    });
  const taints = node.spec?.taints?.map(createTaint) ?? [];
  return {
    availability,
    labels,
    taints,
  };
}
