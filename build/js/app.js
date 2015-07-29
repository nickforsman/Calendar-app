;(function() {
	angular.module('CalendarApp', [
		'ngRoute',
        'firebase',
		'CalendarApp.login'
	])

	.config(function($routeProvider) {
		$routeProvider.otherwise({ redirectTo: '/login' });
	});
})();
;(function() {

	var LoginController = function(firebaseService) {
		var vm = this;

		vm.login = function() {
			return firebaseService.googleAuth();
		};
	};


	angular.module('CalendarApp.login', [])

	.config(function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'src/app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'login',
        });
	})

	.controller('LoginController', [
		'firebaseService',
        LoginController
    ]);
})();

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
;(function() {
	'use strict';
	
	angular.module('CalendarApp')
	.constant('FBURL', 'https://sweltering-torch-161.firebaseio.com');

})();
