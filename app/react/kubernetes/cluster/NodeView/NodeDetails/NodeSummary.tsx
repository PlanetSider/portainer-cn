import { Node, Endpoints } from 'kubernetes-types/core/v1';
import { useMemo } from 'react';

import { formatDate } from '@/portainer/filters/filters';
import {
  getRole,
  getInternalNodeIpAddress,
  getNodeApiDetails,
  getNodeStatus,
  getAvailability,
} from '@/react/kubernetes/cluster/nodeUtils';

import { Badge } from '@@/Badge';
import { DetailsTable } from '@@/DetailsTable';
import { StatusBadge, StatusBadgeType } from '@@/StatusBadge';
import { PortainerSelect, Option } from '@@/form-components/PortainerSelect';
import { FormError } from '@@/form-components/FormError';

import { NodeAvailability } from '../../types';

import { DrainOptions } from './DrainOptions';
import { DrainOptions as DrainOptionsValues } from './types';

type Props = {
  node: Node;
  endpoints: Endpoints[];
  availability: NodeAvailability;
  error?: string;
  onChangeAvailability: (availability: NodeAvailability) => void;
  drainOptions: DrainOptionsValues;
  onChangeDrainOptions: (drainOptions: DrainOptionsValues) => void;
  hasNodeWriteAccess: boolean;
};

const availabilityOptions: Option<NodeAvailability>[] = [
  {
    label: '活动',
    value: 'Active',
  },
  {
    label: '暂停',
    value: 'Pause',
  },
  {
    label: '排空',
    value: 'Drain',
  },
];

export function NodeSummary({
  node,
  endpoints,
  availability,
  onChangeAvailability,
  drainOptions,
  onChangeDrainOptions,
  hasNodeWriteAccess,
  error,
}: Props) {
  const parsedNode = useMemo(
    () => parseNodeValues(node, endpoints),
    [node, endpoints]
  );

  return (
    <DetailsTable dataCy="node-summary">
      <tr>
        <td className="col-sm-3">主机名</td>
        <td>
          {parsedNode.name}
          {parsedNode.isApi && (
            <Badge type="info" className="ml-2">
              api
            </Badge>
          )}
        </td>
      </tr>
      {parsedNode.isApi && (
        <tr>
          <td>Kubernetes API 地址</td>
          <td>{`${parsedNode.ipAddress}:${parsedNode.apiPort}`}</td>
        </tr>
      )}
      <tr>
        <td>角色</td>
        <td>{getRoleLabel(parsedNode.role)}</td>
      </tr>
      <tr>
        <td>Kubelet 版本</td>
        <td>{parsedNode.version || '-'}</td>
      </tr>
      <tr>
        <td>创建日期</td>
        <td>{parsedNode.creationDate || '-'}</td>
      </tr>
      <tr>
        <td>状态</td>
        <td>
          <div className="flex items-center">
            <StatusBadge color={parsedNode.statusType}>
              {getStatusLabel(parsedNode.status)}
            </StatusBadge>
            {parsedNode.status === 'Warning' && parsedNode.warningMessage && (
              <span className="text-warning ml-2">
                {getWarningLabel(parsedNode.warningMessage)}
              </span>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td>可用性</td>
        <td>
          {hasNodeWriteAccess ? (
            <>
              <PortainerSelect
                options={availabilityOptions}
                value={availability}
                onChange={(value) => {
                  if (value) {
                    onChangeAvailability(value);
                  }
                }}
                data-cy="node-availability-select"
                inputId="node-availability-select"
                aria-label="可用性"
              />
              <FormError>{error}</FormError>
            </>
          ) : (
            getAvailabilityLabel(availability)
          )}
        </td>
      </tr>
      {availability === 'Drain' && (
        <tr>
          <td colSpan={2}>
            <DrainOptions
              values={drainOptions}
              onChange={onChangeDrainOptions}
              hasNodeWriteAccess={hasNodeWriteAccess}
            />
          </td>
        </tr>
      )}
    </DetailsTable>
  );
}

function getRoleLabel(role: string) {
  return role === 'Control plane' ? '控制平面' : '工作节点';
}

function getAvailabilityLabel(availability: NodeAvailability) {
  return {
    Active: '活动',
    Pause: '暂停',
    Drain: '排空',
  }[availability];
}

function getStatusLabel(status: string) {
  return {
    Ready: '就绪',
    Warning: '警告',
    Unhealthy: '不健康',
  }[status] ?? status;
}

function getWarningLabel(message?: string) {
  return {
    'Node memory is running low': '节点内存不足',
    'Too many processes running on the node': '节点上运行的进程过多',
    'Node disk capacity is running low': '节点磁盘容量不足',
    'Incorrect node network configuration': '节点网络配置不正确',
  }[message ?? ''] ?? message;
}

interface ParsedNodeData {
  name: string;
  isApi: boolean;
  ipAddress?: string;
  apiPort?: number;
  role: string;
  version?: string;
  creationDate?: string;
  status: string;
  statusType: StatusBadgeType;
  warningMessage?: string;
  availability: NodeAvailability;
}

function parseNodeValues(node: Node, endpoints: Endpoints[]): ParsedNodeData {
  const name = node.metadata?.name || '';
  const ipAddress = getInternalNodeIpAddress(node);
  const { apiPort, isApi } = getNodeApiDetails(node, endpoints);
  const role = getRole(node);
  const version = node.status?.nodeInfo?.kubeletVersion;
  const creationDate = node.metadata?.creationTimestamp
    ? formatDate(node.metadata.creationTimestamp)
    : undefined;
  const { status, statusType, warningMessage } = getNodeStatus(node);
  const availability = getAvailability(node);
  return {
    name,
    isApi,
    ipAddress,
    apiPort,
    role,
    version,
    creationDate,
    status,
    statusType,
    availability,
    warningMessage,
  };
}
