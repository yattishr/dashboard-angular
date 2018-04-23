(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.subtypes')
        .controller('SubtypesCtrl', SubtypesCtrl);

    /** @ngInject */
    function SubtypesCtrl($scope,environmentConfig,$uibModal,toastr,$http,localStorageManagement,errorHandler,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.updatedSubtype = {};
        $scope.loadingSubtypes = true;
        $scope.editingSubtype = false;
        $scope.editSubtype = {};
        $scope.newSubtype = {
            tx_type: 'credit'
        };

        $scope.toggleSubtypeEditView = function(subtype){
            if(subtype) {
                vm.getSubtype(subtype);
            } else {
                $scope.editSubtype = {};
                vm.getSubtypes();
            }
            $scope.editingSubtype = !$scope.editingSubtype;
        };

        vm.getSubtype = function (subtype) {
            $scope.loadingSubtypes = true;
            $http.get(environmentConfig.API + '/admin/subtypes/' + subtype.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingSubtypes = false;
                if (res.status === 200) {
                    $scope.editSubtype = res.data.data;
                }
            }).catch(function (error) {
                $scope.loadingSubtypes = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getSubtypes = function () {
            if(vm.token) {
                $scope.loadingSubtypes = true;
                $http.get(environmentConfig.API + '/admin/subtypes/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingSubtypes = false;
                    if (res.status === 200) {
                        $scope.subtypes = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingSubtypes = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getSubtypes();

        $scope.addSubtype = function(){
            $scope.loadingSubtypes = true;
            $http.post(environmentConfig.API + '/admin/subtypes/', $scope.newSubtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingSubtypes = false;
                if (res.status === 201) {
                    vm.getSubtypes();
                    toastr.success('You have successfully added a new subtype');
                    $scope.newSubtype = {tx_type: 'credit'};
                    $window.scrollTo(0, 0);
                }
            }).catch(function (error) {
                $scope.loadingSubtypes = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.subtypeChanged = function(field){
            if(field == 'name'){
                $scope.editSubtype.name = $scope.editSubtype.name.toLowerCase();
            }

            vm.updatedSubtype[field] = $scope.editSubtype[field];
        };

        $scope.updateSubtype = function () {
            $window.scrollTo(0, 0);
            $scope.editingSubtype = !$scope.editingSubtype;
            $scope.loadingSubtypes = true;
            $http.patch(environmentConfig.API + '/admin/subtypes/'+ $scope.editSubtype.id + '/', vm.updatedSubtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingSubtypes = false;
                if (res.status === 200) {
                    vm.updatedSubtype = {};
                    vm.getSubtypes();
                    toastr.success('You have successfully updated the subtype');
                }
            }).catch(function (error) {
                $scope.loadingSubtypes = false;
                vm.updatedSubtype = {};
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.findIndexOfSubtype = function(element){
            return this.id == element.id;
        };

        $scope.openSubtypeModal = function (page, size,subtype) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'SubtypeModalCtrl',
                scope: $scope,
                resolve: {
                    subtype: function () {
                        return subtype;
                    }
                }
            });

            vm.theModal.result.then(function(subtype){
                var index = $scope.subtypes.findIndex(vm.findIndexOfSubtype,subtype);
                $scope.subtypes.splice(index, 1);
            }, function(){
            });
        };
    }
})();
