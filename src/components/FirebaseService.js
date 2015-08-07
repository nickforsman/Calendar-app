;(function() {
	'use strict';
	
	function firebaseService($location, FBURL, $firebaseAuth) {
		var ref = new Firebase(FBURL);
		var auth = $firebaseAuth(ref);

		this.isLoggedIn = function() {
            return ref.getAuth();
        };

        this.logout = function() {
        	ref.unauth();
        	$location.path('/login');
        };

		this.googleAuth = function() {
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