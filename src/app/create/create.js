;(function() {
	'use strict';

	var CreateController = function($scope, firebaseService, calendarFactory) {
		var vm = this;
		vm.attendees = [];
		

		vm.addAttendee = function() {
			vm.attendees.push({'email': vm.attendee.email});
			vm.attendee.email = "";
		};

		vm.createEvent = function() {
			var calendarEvent = {
				'summary': vm.title,
				  'location': '800 Howard St., San Francisco, CA 94103',
				  'description': vm.description,
				  'start': {
				    'date': new Date(vm.startDate).toISOString().substring(0, 10),
				  },
				  'end': {
				    'date': new Date(vm.endDate).toISOString().substring(0, 10),
				  },
				  'attendees': vm.attendees,
				  'reminders': {
				    'useDefault': false,
				    'overrides': [
				      {'method': 'email', 'minutes': 24 * 60},
				      {'method': 'sms', 'minutes': 10}
				    ]
				  }
			};
			console.log(calendarEvent);
			calendarFactory.create(calendarEvent);
		};

		vm.logout = function() {
			firebaseService.logout();
		};

	};


	angular.module('CalendarApp')

	.config(function($routeProvider) {
        $routeProvider.when('/create', {
            templateUrl: 'src/app/create/create.html',
            controller: 'CreateController',
            controllerAs: 'event'
        });
	})

	.controller('CreateController', [
		'$scope',
		'firebaseService',
		'calendarFactory',
		CreateController
	]);
})();