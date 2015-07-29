;(function() {
	
	function firebaseService($q, FBURL, $firebaseAuth) {
		var ref = new Firebase(FBURL);
		var auth = $firebaseAuth(ref);
		var deferred = $q.defer();

		this.googleAuth = function() {
			auth.$authWithOAuthPopup("google").then(function(payload) {
				console.log(payload);
			}).catch(function(err) {
				console.log(err);
			});
		};
	}

	angular.module('CalendarApp')

	.service('firebaseService', [
	    '$q', 
        'FBURL',
        '$firebaseAuth',
		firebaseService
	]);
})();