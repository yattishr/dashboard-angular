(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('AddPublicAddressModalCtrl', AddPublicAddressModalCtrl);

    function AddPublicAddressModalCtrl($scope,$uibModalInstance,toastr,$http,cookieManagement,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.addingPublicAddress = false;
        $scope.publicAddressParams = {
            address: ''
        };

        $scope.addPublicAddress = function (publicAddressParams) {
            $scope.addingPublicAddress = true;

            $http.post(vm.serviceUrl + 'admin/coldstorage/public-addresses/', publicAddressParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicAddress = false;
                if (res.status === 201) {
                    toastr.success('Public address successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingPublicAddress = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };




    }
})();