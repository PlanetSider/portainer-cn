import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmUpdateAppIngress(
  ingressesToUpdate: Array<unknown>,
  servicePortsToUpdate: Array<unknown>
) {
  const hasOneIngress = ingressesToUpdate.length === 1;
  const hasOnePort = servicePortsToUpdate.length === 1;
  const ingressRuleDescription = hasOneIngress
    ? '该 Ingress 规则'
    : '这些 Ingress 规则';
  const noMatchSentence = !hasOnePort
    ? `此应用中的 Service 端口不再与${ingressRuleDescription}匹配。`
    : `此应用中的一个 Service 端口不再与${ingressRuleDescription}匹配，可能导致 Ingress 路径失效。`;
  const inputLabel = `更新${ingressRuleDescription}以匹配 Service 端口变更`;

  const result = await openSwitchPrompt('确定要更新吗？', inputLabel, {
    message: (
      <ul className="ml-3">
        <li>更新应用可能导致服务中断。</li>
        <li>{noMatchSentence}</li>
      </ul>
    ),
    confirmButton: buildConfirmButton('更新'),
    'data-cy': 'kube-update-ingress-prompt-switch',
  });

  return result ? { noMatch: result.value } : undefined;
}
