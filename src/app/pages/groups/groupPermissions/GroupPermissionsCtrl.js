(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupPermissions')
        .controller('GroupPermissionsCtrl', GroupPermissionsCtrl);

    /** @ngInject */
    function GroupPermissionsCtrl($scope,$stateParams,Rehive,localStorageManagement,
                                  errorHandler,toastr,$location,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        vm.checkedLevels = [];
        $scope.loadingPermissions = true;
        $scope.totalPermissionsObj = {};
        $scope.typeOptionsObj = {
            ACCOUNT : 'account',
            ACCOUNT_CURRENCY : 'accountcurrency',
            ACCOUNT_CURRENCY_FEE : 'accountcurrencyfee',
            ACCOUNT_CURRENCY_LIMIT : 'accountcurrencylimit',
            CURRENCY : 'currency',
            BANK_BRANCH_ADDRESS : 'bankbranchaddress',
            COMPANY : 'company',
            COMPANY_ADDRESS : 'companyaddress',
            COMPANY_BANK_ACCOUNT : 'companybankaccount',
            COMPANY_NOTIFICATION : 'companynotification',
            COMPANY_SERVICE : 'companyservice',
            CRYPTO_ACCOUNT : 'cryptoaccount',
            DOCUMENT : 'document',
            USER : 'user',
            USER_ADDRESS : 'useraddress',
            USER_BANK_ACCOUNT : 'userbankaccount',
            MOBILE : 'mobile',
            GROUP: 'group',
            GROUP_TIER: 'grouptier',
            GROUP_TIER_FEE: 'grouptierfee',
            GROUP_TIER_LIMIT: 'grouptierlimit',
            GROUP_TIER_REQUIREMENT: 'grouptierrequirement',
            ACCOUNT_CONFIGURATION: 'accountconfiguration',
            REQUEST : 'request',
            SERVICE : 'service',
            TRANSACTION : 'transaction',
            TRANSACTION_FEE : 'transactionfee',
            TRANSACTION_MESSAGE : 'transactionmessage',
            TRANSACTION_SUBTYPE : 'transactionsubtype',
            TRANSFER : 'transfer',
            WEBHOOK : 'webhook',
            WEBHOOK_REQUEST : 'webhookrequest',
            WEBHOOK_TASK : 'webhooktask'
        };

        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: vm.groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    vm.getGroupUsers($scope.editGroupObj);
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroup();

        vm.getGroupUsers = function (group) {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.users.overview.get({filters: {
                    group: group.name
                }}).then(function (res) {
                    $scope.totalUsersCount = res.total;
                    $scope.deactiveUsersCount = res.archived;
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.initializePermissions = function () {
            $scope.totalPermissionsObj.accountPermissionsOptions = {
                permissionsName: 'Account permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Account',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Account currency',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Account currency limit',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Account currency fee',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.currencyPermissionsOptions = {
                permissionsName: 'Currency permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Currency',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.companyPermissionsOptions = {
                permissionsName: 'Company permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Bank branch address',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company address',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company bank account',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company notification',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company service',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.userPermissionsOptions = {
                permissionsName: 'User permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Crypto account',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Document',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'User',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'User address',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'User bank account',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Mobile',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.groupPermissionsOptions = {
                permissionsName: 'Group permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Group',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group tier',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group tier fee',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group tier limit',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group tier requirement',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Account configuration',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.miscPermissionsOptions = {
                permissionsName: 'Misc permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Request',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Service',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.transactionPermissionsOptions = {
                permissionsName: 'Transaction permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Transaction',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction fee',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction message',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction subtype',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transfer',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.webhookPermissionsOptions = {
                permissionsName: 'Webhook permissions',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Webhook',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Webhook request',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Webhook task',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};


        };
        vm.initializePermissions();

        vm.getPermissions = function () {
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.groups.permissions.get(vm.groupName,{filters: {page_size: 200}}).then(function (res) {
                    $scope.loadingPermissions = false;
                    vm.checkforAllowedPermissions(res.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getPermissions();

        vm.checkforAllowedPermissions = function (permissionsArray) {

            permissionsArray.forEach(function (permission,index) {
                Object.keys($scope.totalPermissionsObj).forEach(function(key) {
                    $scope.totalPermissionsObj[key].permissions.forEach(function (element,permissionsIndex) {
                        if(permission.type.toLowerCase() == element.type.toLowerCase()){
                            element.levels.forEach(function (level,levelIndex) {
                                if(permission.level == level.name){
                                    $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[levelIndex].enabled = true;
                                    $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[levelIndex].id = permissionsArray[index].id;
                                    $scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter = $scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter + 1;
                                    if($scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter === 4){
                                        var allIndex = $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels.findIndex(function (element) {
                                            return element.name == 'all';
                                        });
                                        $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[allIndex].enabled = true;
                                    }

                                    $scope.totalPermissionsObj[key].permissionCounter = $scope.totalPermissionsObj[key].permissionCounter + 1;
                                    if($scope.totalPermissionsObj[key].permissionCounter == (($scope.totalPermissionsObj[key].permissions.length) * 4)){
                                        $scope.totalPermissionsObj[key].enableAll = true;
                                    }
                                }
                            });
                        }
                    });
                });
            });

        };

        $scope.toggleAllPermissions = function (key,enabledAll) {
            $scope.totalPermissionsObj[key].permissions.forEach(function (permission) {
                permission.levels.forEach(function (level) {
                    if(level.name === 'all'){
                        level.enabled = enabledAll;
                        $scope.trackPermissions(permission,level,key);
                    }
                });
            });
        };

        $scope.trackPermissions = function (permission,level,permissionOptionKey) {

            //using id as a flag to see whether they have come from the backend or not

            var findIndexOfLevel = function (permissionObj,levelObj) {
                var index;
                if(vm.checkedLevels.length == 0){
                    return -1;
                }

                index = vm.checkedLevels.findIndex(function (element) {
                    return (element.type == permissionObj.type && element.level == levelObj.name);
                });

                return index;
            };

            //if all is selected

            if(level.name == 'all'){
                if(level.enabled){
                    permission.levels.forEach(function (permissionsLevel) {
                        if(!permissionsLevel.id && !permissionsLevel.enabled){
                            permissionsLevel.enabled = true;
                            vm.checkedLevels.push({type: permission.type,level: permissionsLevel.name});
                            permission.levelCounter = 4;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                            }
                        } else if(permissionsLevel.id && !permissionsLevel.enabled){
                            permissionsLevel.enabled = true;
                            var index = findIndexOfLevel(permission,permissionsLevel);
                            vm.checkedLevels.splice(index,1);
                            permission.levelCounter = 4;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                            }
                        }
                    });
                } else {
                    permission.levels.forEach(function (permissionsLevel) {
                        if(permissionsLevel.id  && permissionsLevel.enabled){
                            permissionsLevel.enabled = false;
                            vm.checkedLevels.push({type: permission.type,level: permissionsLevel.name,id: permissionsLevel.id});
                            permission.levelCounter = 0;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                            }
                        } else if(!permissionsLevel.id  && permissionsLevel.enabled) {
                            permissionsLevel.enabled = false;
                            var index = findIndexOfLevel(permission,permissionsLevel);
                            vm.checkedLevels.splice(index,1);
                            permission.levelCounter = 0;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                            }
                        }
                    });
                }

            } else {

                //level.enabled && level.id means they were ticked from before

                if(level.enabled && level.id){
                    var index = findIndexOfLevel(permission,level);
                    if(index > -1){
                        vm.checkedLevels.splice(index,1);
                        permission.levelCounter = permission.levelCounter + 1;
                        if(permission.levelCounter === 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = true;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                        }
                        return;
                    } else {
                        vm.checkedLevels.push({type: permission.type,level: level.name,id: level.id});
                        permission.levelCounter = permission.levelCounter - 1;
                        if(permission.levelCounter < 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = false;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                        }
                        return;
                    }
                } else if(!level.enabled && level.id){
                    var index = findIndexOfLevel(permission,level);
                    if(index > -1){
                        vm.checkedLevels.splice(index,1);
                        permission.levelCounter = permission.levelCounter + 1;
                        if(permission.levelCounter === 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = true;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                        }
                        return;
                    } else {
                        vm.checkedLevels.push({type: permission.type,level: level.name,id: level.id});
                        permission.levelCounter = permission.levelCounter - 1;
                        if(permission.levelCounter < 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = false;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                        }
                        return;
                    }
                }

                //only level.enabled means they were not ticked from before

                if(level.enabled){
                    vm.checkedLevels.push({type: permission.type,level: level.name});
                    permission.levelCounter = permission.levelCounter + 1;
                    if(permission.levelCounter === 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = true;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                    if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                        $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                    }
                } else {
                    var index = findIndexOfLevel(permission,level);
                    vm.checkedLevels.splice(index,1);
                    permission.levelCounter = permission.levelCounter - 1;
                    if(permission.levelCounter < 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = false;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                    if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                        $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                    }
                }
            }
        };

        $scope.savePermissionsProcess = function(){
            vm.checkedLevels.forEach(function(element,idx,array){
                $scope.loadingPermissions = true;
                var type;
                type = element.type.toUpperCase();
                type = type.replace(/ /g, '_');
                if(idx === array.length - 1){
                    if(element.id){
                        vm.deletePermission(element,'last');
                    } else {
                        vm.addPermissions({type: $scope.typeOptionsObj[type],level: element.level},'last');
                    }

                    return false;
                }

                if(element.id){
                    vm.deletePermission(element);
                } else {
                    vm.addPermissions({type: $scope.typeOptionsObj[type],level: element.level});
                }

            });
        };

        vm.addPermissions = function (newPermissionObj,last) {
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.groups.permissions.create(vm.groupName,newPermissionObj).then(function (res) {
                    if(last){
                        vm.finishSavingPermissionsProcess();
                    }
                }, function (error) {
                    vm.checkedLevels = [];
                    $scope.permissionParams = {
                        type: 'Account'
                    };
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.deletePermission = function (permission,last) {
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.groups.permissions.delete(vm.groupName,permission.id).then(function (res) {
                    if(last){
                        vm.finishSavingPermissionsProcess();
                    }
                }, function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.finishSavingPermissionsProcess = function () {
            vm.initializePermissions();
            $timeout(function () {
                $scope.loadingPermissions = false;
                vm.checkedLevels = [];
                toastr.success('Permissions successfully saved');
                vm.getPermissions();
            },2500);
        };


    }
})();