;(function() {
	'use strict';
	angular.module('CalendarApp', [
		'ngRoute',
        'firebase',
	])

	.run(function($rootScope, $location, firebaseService) {
		$rootScope.logout = function() {
			firebaseService.logout();
		};

		$rootScope.isActiveNav = function(path) {
			return path == $location.path();
		};

		// e: event, n: next, c: current
		$rootScope.$on('$routeChangeStart', function(e, n, c) {
			if ( ! firebaseService.isLoggedIn()) {
				$location.path('/login');
			} 
		});	
	})

	.config(function($routeProvider) {
		$routeProvider.otherwise({ redirectTo: '/login' });
	});
})();