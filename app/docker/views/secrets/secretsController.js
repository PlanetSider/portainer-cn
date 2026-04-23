import { processItemsInBatches } from '@/react/common/processItemsInBatches';

angular.module('portainer.docker').controller('SecretsController', [
  '$scope',
  '$state',
  'SecretService',
  'Notifications',
  function ($scope, $state, SecretService, Notifications) {
    $scope.removeAction = async function (selectedItems) {
      async function doRemove(secret) {
        return SecretService.remove(secret.Id)
          .then(function success() {
            Notifications.success('Secret 已成功删除', secret.Name);
            var index = $scope.secrets.indexOf(secret);
            $scope.secrets.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除 Secret');
          });
      }

      await processItemsInBatches(selectedItems, doRemove);
      $state.reload();
    };

    $scope.getSecrets = getSecrets;

    function getSecrets() {
      SecretService.secrets()
        .then(function success(data) {
          $scope.secrets = data;
        })
        .catch(function error(err) {
          $scope.secrets = [];
          Notifications.error('失败', err, '无法获取 Secrets');
        });
    }

    function initView() {
      getSecrets();
    }

    initView();
  },
]);
