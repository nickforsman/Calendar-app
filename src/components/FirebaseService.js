/**
 * Firebase Service
 * @namespace Services
 */
;(function() {
	'use strict';
	
	/**
	 * FirebaseService handles login, logout, Oauth and checks if user is logged in
	 * @param  {Object} Angular $location object
	 * @param  {String} Firebase URL constant
	 * @param  {Object} FirebaseAuth object
	 */
	function firebaseService($location, FBURL, $firebaseAuth) {
		// Creates a new reference connection to firebase
		var ref = new Firebase(FBURL);
		// Creates a new firebase authentication reference
		var auth = $firebaseAuth(ref);

		/**
		 * Checks if user is loggedIn
		 * @return {Boolean && Object} 
		 */
		this.isLoggedIn = function() {
            return ref.getAuth();
        };

        /**
         * Logs user out of current auth reference
         * And redirects back to login
         */
        this.logout = function() {
        	ref.unauth();
        	$location.path('/login');
        };

        /**
         * Handles google authentication for the app
         * @return {Object} FirebaseAuth promise
         */
		this.googleAuth = function() {
			// Saves auth result in login var
			// Scope: scopes for google auth
			var login = auth.$authWithOAuthPopup("google", {
				scope: [
					'https://www.googleapis.com/auth/calendar',
					'https://www.googleapis.com/auth/calendar.readonly'
				] 
			});

			login.then(function(payload) {
				return payload;
			});

			login.catch(function(err) {
				return err;
			});

			return login;
		};
	}

	angular.module('CalendarApp')

	.service('firebaseService', [
	    '$location', 
        'FBURL',
        '$firebaseAuth',
		firebaseService
	]);
})();