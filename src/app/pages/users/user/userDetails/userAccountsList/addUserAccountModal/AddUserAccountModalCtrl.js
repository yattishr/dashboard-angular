(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserAccountsListModalCtrl', AddUserAccountsListModalCtrl);

    function AddUserAccountsListModalCtrl($scope,$uibModalInstance,toastr,$stateParams,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.newUserAccountParams = {};
        vm.uuid = $stateParams.uuid;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.addNewUserAccount = function(newUserAccountParams){
            if(vm.token) {
                newUserAccountParams.user = vm.uuid;
                $scope.loadingUserAccountsList = true;
                $http.post(environmentConfig.API + '/admin/accounts/', newUserAccountParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.newUserAccountParams = {};
                        toastr.success('Account successfully added');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();