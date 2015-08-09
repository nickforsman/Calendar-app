/**
 * Login Controller
 * @namespace Controllers
 */
;(function() {
	'use strict';

	/**
	 * LoginController handles logging in and rendering login template
	 * @param {Object} firebaseService
	 * @param {Object} Angular $location object
	 * @param {Object} $exceptionHandler
	 */
	var LoginController = function(firebaseService, $location, $exceptionHandler) {
		// scope this keyword to vm
		var vm = this;

		/**
		 * Login, tries to log user in
		 * firebaseSerive handles google auth scopes
		 * @throws {Exception} If user could not be logged in
		 */
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
            templateUrl: '/templates/login.html',
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