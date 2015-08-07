;(function() {
	'use strict';

	var CalendarController = function(calendarFactory, $exceptionHandler) {
		var vm = this;
		vm.eventSources = [[]];

		vm.init = function() {
			vm.list();
		};
		
		vm.list = function() {
			calendarFactory.list().success(function(data) {
				data.items.forEach(function(item) {
					if (item.status !== 'cancelled') {
						vm.eventSources[0].push({
							title: item.summary,
							start: item.start.dateTime || item.start.date,
							end: item.end.dateTime || item.end.date,
							stick: true,
						});	
					}
				});
			}).error(function(err) {
				$exceptionHandler(err);
			});
		};
		
		vm.init();
	};

	angular.module('CalendarApp')

	.config(function($routeProvider) {
        $routeProvider.when('/calendar', {
            templateUrl: 'src/app/calendar/calendar.html',
            controller: 'CalendarController',
            controllerAs: 'calendar',
        });
	})

	.controller('CalendarController', [
		'calendarFactory',
		'$exceptionHandler',
		CalendarController
	]);
})();