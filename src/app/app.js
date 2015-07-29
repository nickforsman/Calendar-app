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