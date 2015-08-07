;(function() {
	'use strict';

	var LoginController = function(firebaseService, $location, $exceptionHandler) {
		var vm = this;

		vm.login = function() {
			firebaseService.googleAuth().then(function(payload) {
				$location.path('/calendar');
			}, function(err) {
				$exceptionHandler(err);
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
		'$exceptionHandler',
        LoginController
    ]);
})();