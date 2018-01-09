(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers')
        .controller('GroupTiersCtrl', GroupTiersCtrl);

    /** @ngInject */
    function GroupTiersCtrl($scope,$stateParams,cookieManagement,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroups = true;

        $scope.goToGroupTiersSettings = function (path) {
            $location.path('/settings/groups-management/' + vm.groupName + '/tiers/' + path);
        };

    }
})();
