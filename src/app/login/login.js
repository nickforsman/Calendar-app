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