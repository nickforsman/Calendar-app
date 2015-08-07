;(function() {
	'use strict';

	var CreateController = function(calendarFactory, $exceptionHandler, flashService) {
		var vm = this;
		vm.attendees = [];
		vm.allDay = false;
		vm.notification = {
			error: '',
			success: ''
		};

		vm.addAttendee = function(email) {
			if (email) {
				vm.attendees.push({'email': email});
				vm.attendee.email = "";
			} else {
				alert('no email');
			} 
		};

		vm.removeAttendee = function(email) {
			var remove = vm.attendees.map(function(index) {
				return index.email;
			}).indexOf(email);

			vm.attendees.splice(remove, 1);
		};

		vm.createEvent = function() {
			vm.loading = true;

			var calendarEvent = {
				  'summary': vm.title,
				  'location': vm.address + ', ' + vm.city,
				  'description': vm.description,
				  'attendees': vm.attendees,
				  'reminders': {
    				'useDefault': false,
				    'overrides': [
				      {'method': 'email', 'minutes': 24 * 60},
				      {'method': 'sms', 'minutes': 10}
				    ]
				  }
			};

			if (vm.allDay) {
				calendarEvent['start'] = {'date': new Date(vm.startDate).toISOString().substring(0, 10)};
				calendarEvent['end'] = {'date': new Date(vm.endDate).toISOString().substring(0, 10)};
			} else {
				calendarEvent['start'] = {'dateTime': new Date(vm.startTime).toISOString()};
				calendarEvent['end'] = {'dateTime': new Date(vm.endTime).toISOString()};
			}

			calendarFactory.create(calendarEvent)
				.success(function(data) {
					handleSuccess(data);
				})
				.error(function(err) {
					handleError(err);
				})
				.finally(function() {
					vm.loading = false;
				});
		};

		function handleError(err) {
			$exceptionHandler(err);
			// clears flash message if session has a flash set
			vm.notification.error = "";
			vm.notification.error = flashService.show(err);
		}

		function handleSuccess(data) {
			// clears flash message if session has a flash set
			vm.notification.success = "";
			vm.notification.success = flashService.show("Your event was created successfully with a title: " + data.summary);
		}

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
		'calendarFactory',
		'$exceptionHandler',
		'flashService',
		CreateController
	]);
})();