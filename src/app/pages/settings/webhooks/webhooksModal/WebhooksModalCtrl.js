(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings')
        .controller('WebhooksModalCtrl', WebhooksModalCtrl);

    function WebhooksModalCtrl($scope,webhook,toastr,$http,API,cookieManagement,errorToasts,errorHandler) {

        var vm = this;

        $scope.webhook = webhook;
        $scope.deletingWebhook = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.findIndexOfWebhooks = function(element){
            return $scope.webhook.id == element.id;
        };

        $scope.deleteWebhook = function () {
            $scope.deletingWebhook = true;
            $http.delete(API + '/admin/webhooks/' + $scope.webhook.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.$dismiss();
                $scope.deletingWebhook = false;
                if (res.status === 200) {
                    var index = $scope.webhooks.findIndex(vm.findIndexOfWebhooks);
                    $scope.webhooks.splice(index, 1);
                    toastr.success('You have successfully deleted the webhook!');
                    $scope.$dismiss();
                }
            }).catch(function (error) {
                $scope.deletingWebhook = false;
                if(error.status == 403){
                    errorHandler.handle403();
                    return
                }
                errorToasts.evaluateErrors(error.data);
            });
        };



    }
})();
