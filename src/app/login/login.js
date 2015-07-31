;(function() {
	'use strict';

	var LoginController = function(firebaseService, $location, $rootScope) {
		var vm = this;

		vm.login = function() {
			firebaseService.googleAuth().then(function(payload) {
				$location.path('/calendar');
			}, function(error) {
				console.log(error);
			});
		};
	};


	angular.module('CalendarApp')

	.config(function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'src/app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'login',
        });
	})

	.controller('LoginController', [
		'firebaseService',
		'$location',
		'$rootScope',
        LoginController
    ]);
})();