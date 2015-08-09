/**
 * Calendar Controller
 * @namespace Controllers
 */
;(function() {
	'use strict';

	/**
	 * Calendar controller handles listing of events and rendering of calendar directive
	 * @param {Object} CalendarFactory
	 * @param {Object} $exceptionHandler
	 */
	var CalendarController = function(calendarFactory, $exceptionHandler) {
		// scope this keyword to vm
		// vm = viewModel
		var vm = this;
		// store event sources for calendar
		// Note* event sources must be array of arrays
		vm.eventSources = [[]];

		vm.init = function() {
			vm.list();
		};
		
		/**
		 * List all events for the current user and stores them in eventSources array
		 * @throws {Exception} If calendarFactory could not list events
		 * Exceptions are handled by angulars $exceptionhandler
		 */
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
            templateUrl: '/templates/calendar.html',
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