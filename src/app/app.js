;(function() {
	'use strict';
	angular.module('CalendarApp', [
		'ngRoute',
        'firebase',
        'ui.calendar'
	])

	.run(['$rootScope', '$location', 'firebaseService', 'User', runblock])

	.config(function($routeProvider) {
		$routeProvider.otherwise({ redirectTo: '/login' });
	});

	function runblock($rootScope, $location, firebaseService, User) {
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
			} else {
				var payload = firebaseService.isLoggedIn();
				User.name = payload.google.displayName;
				User.email = payload.google.email;
				User.profileImg = payload.google.profileImageURL;
				User.accessToken = payload.google.accessToken;
			}
		});	
	}
})();