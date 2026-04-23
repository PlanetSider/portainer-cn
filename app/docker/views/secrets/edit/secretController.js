import { ResourceControlType } from '@/react/portainer/access-control/types';

angular.module('portainer.docker').controller('SecretController', SecretController);

/* @ngInject */
function SecretController($scope, $transition$, $state, SecretService, Notifications, endpoint) {
  $scope.resourceType = ResourceControlType.Secret;
  $scope.endpoint = endpoint;
  $scope.onUpdateResourceControlSuccess = function () {
    $state.reload();
  };

  $scope.removeSecret = function removeSecret(secretId) {
    SecretService.remove(secretId)
      .then(function success() {
        Notifications.success('成功', 'Secret 已成功删除');
        $state.go('docker.secrets', {});
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法删除 Secret');
      });
  };

  function initView() {
    SecretService.secret($transition$.params().id)
      .then(function success(data) {
        $scope.secret = data;
      })
      .catch(function error(err) {
        Notifications.error('失败', err, '无法获取 Secret 详情');
      });
  }

  initView();
}
