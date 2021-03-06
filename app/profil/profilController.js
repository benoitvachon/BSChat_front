'use strict';

angular.module('myApp.profilController', ['ngRoute'])

.controller('profilController', function($scope, $http, Auth) {

    if (!Auth.isConnected()) {
        window.location = 'https://bschat.guillaumeperes.fr/#/';
    }
    $scope.userEdit = false;

    Auth.user().then(function(response) {
        $scope.user = response;
        $scope.userToEdit = angular.copy($scope.user);
    });

    $scope.updateUser = function () {

        $http.post('https://api.bschat.guillaumeperes.fr/api/user/update', $scope.userToEdit).
        then(function (response) {
            $scope.user = $scope.userToEdit;
            $scope.editProfile();
        });
    };

    $scope.cancelEdition = function () {
        $scope.editProfile();
        $scope.resetUserToEdit();
    };

    $scope.editProfile = function () {
        $scope.userEdit = !$scope.userEdit;
    };

    $scope.resetUserToEdit = function () {
        $scope.userToEdit = angular.copy($scope.user);
    };

    $scope.validUserToEdit = function () {
        $scope.user = angular.copy($scope.userToEdit);
    }

    $scope.goBack = function () {
        window.history.go(-1);
    }
});