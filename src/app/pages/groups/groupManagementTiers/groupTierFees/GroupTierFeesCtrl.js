(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees')
        .controller('GroupTierFeesCtrl', GroupTierFeesCtrl);

    /** @ngInject */
    function GroupTierFeesCtrl($scope,$stateParams,localStorageManagement,_,$window,$ngConfirm,
                               Rehive,$timeout,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        $scope.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.activeTabIndex = 0;
        $scope.loadingTierFees = true;
        vm.updatedTierFee = {};

        vm.returnCurrencyObj = function (currencyCode) {
            return $scope.currenciesList.find(function (element) {
                return (element.code == currencyCode);
            });
        };

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierFees = true;
                Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
                    $scope.loadingTierFees = false;
                    vm.unsortedTierLevelsArray = _.pluck(res ,'level');
                    vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                        return a - b;
                    });
                    $scope.tierLevelsForFees = vm.sortedTierLevelsArray;
                    $scope.allTiers = res.sort(function(a, b) {
                        return parseFloat(a.level) - parseFloat(b.level);
                    });
                    if(tierLevel){
                        $scope.selectTier(tierLevel);
                    } else {
                        $timeout(function(){
                            $scope.activeTabIndex = 0;
                        });
                        $scope.selectTier($scope.tierLevelsForFees[0]);
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getAllTiers();

        vm.findIndexOfTier = function(element){
            return this == element.level;
        };

        $scope.selectTier = function(tierLevel){
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierFees();
            }
        };

        $scope.getTierFees = function(){
            if(vm.token) {
                $scope.loadingTierFees = true;
                Rehive.admin.groups.tiers.fees.get(vm.groupName,$scope.selectedTier.id).then(function (res) {
                    $scope.loadingTierFees = false;
                    res.forEach(function (element) {
                        element.currency = vm.returnCurrencyObj(element.currency);
                    });

                    $scope.tiersFeesList = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openAddGroupTierFeeModal = function (page, size) {
            vm.theAddFeeModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupTierFeeModalCtrl',
                scope: $scope,
                resolve: {
                    selectedTier: function () {
                        return $scope.selectedTier;
                    }
                }
            });

            vm.theAddFeeModal.result.then(function(tierLevel){
                if(tierLevel){
                    $scope.getAllTiers(tierLevel);
                }
            }, function(){
            });
        };

        $scope.openEditGroupTierFeeModal = function (page, size,tierFee) {
            vm.theEditModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditGroupTierFeeModalCtrl',
                scope: $scope,
                resolve: {
                    tierFee: function () {
                        return tierFee;
                    },
                    selectedTier: function () {
                        return $scope.selectedTier;
                    }
                }
            });

            vm.theEditModal.result.then(function(tierLevel){
                if(tierLevel){
                    $scope.getAllTiers(tierLevel);
                }
            }, function(){
            });
        };

        $scope.deleteTierFeeConfirm = function (tierFee) {
            $ngConfirm({
                title: 'Delete tier fee',
                content: 'Are you sure you want to remove this tier fee?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteTierFee(tierFee);
                        }
                    }
                }
            });
        };

        $scope.deleteTierFee = function (tierFee) {
            $scope.loadingTierFees = true;
            Rehive.admin.groups.tiers.fees.delete(vm.groupName,$scope.selectedTier.id, tierFee.id).then(function (res) {
                $scope.loadingTierFees = false;
                toastr.success('Tier fee successfully deleted');
                $scope.getAllTiers($scope.selectedTier.level);
                $scope.$apply();
            }, function (error) {
                $scope.loadingTierFees = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
