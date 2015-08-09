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

	/**
	 * Run block for appilcation
	 * @param  {Object} Angular $rootScope
	 * @param  {Object} Angular $location
	 * @param  {Object} FirebaseService
	 * @param  {Object} User Constant
	 */
	function runblock($rootScope, $location, firebaseService, User) {
		// Logs user out
		// Logout should be globally available on all routes
		$rootScope.logout = function() {
			firebaseService.logout();
		};
		
		/**
		 * Adds active class to nav link
		 * @param  {String}
		 * @return {Boolean}
		 */
		$rootScope.isActiveNav = function(path) {
			return path == $location.path();
		};

		/**
		 * Functions runs on every route change event
		 * @param  {String} $routeChangeStart
		 * @param  {Object} Event
		 * @param  {Object} Next
		 * @param {Object} Current
		 */
		$rootScope.$on('$routeChangeStart', function(e, n, c) {
			// Checks if user is still logged in
			if ( ! firebaseService.isLoggedIn()) {
				$location.path('/login');
			} else {
				// If logged in add user data to user constant
				// This has potential security risks, firebase cannot save access token to current ref
				// Firebase save current user in an excluded firebase ref
				var payload = firebaseService.isLoggedIn();
				User.name = payload.google.displayName;
				User.email = payload.google.email;
				User.profileImg = payload.google.profileImageURL;
				User.accessToken = payload.google.accessToken;
			}
		});	
	}
})();