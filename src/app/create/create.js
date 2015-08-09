/**
 * Create Controller
 * @namespace Controllers
 */
;(function() {
	'use strict';

	/**
	 * CreateController handles creating of events and form validation & handling
	 * @param {Object} calendarFactory
	 * @param {Object} $exceptionHandler
	 * @param {Object} flashService
	 */
	var CreateController = function(calendarFactory, $exceptionHandler, flashService) {
		// scope this keyword to vm
		var vm = this;
		// event attendees array
		vm.attendees = [];
		// all day event
		vm.allDay = false;
		// flash notification object
		vm.notification = {
			error: '',
			success: ''
		};

		/**
		 * Adds attendee to vm.attendee array
		 * @param {String} email of attendee
		 */
		vm.addAttendee = function(email) {
			if (email) {
				vm.attendees.push({'email': email});
				vm.attendee.email = "";
			} else {
				alert('no email');
			} 
		};

		/**
	 	* Removes attendee to vm.attendee array
	 	* @param {String} email of attendee
	 	*/
		vm.removeAttendee = function(email) {
			var remove = vm.attendees.map(function(index) {
				return index.email;
			}).indexOf(email);

			vm.attendees.splice(remove, 1);
		};

		/**
		 * Creates an event based on user input
		 * @thorws {Exception} If event could not be created
		 */
		vm.createEvent = function() {
			// Start loading icon
			vm.loading = true;

			/**
			 * The calendar evetn object
			 * Reminders mustbe set in evetn object
			 * @type {Object}
			 */
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

			// If event is all day, add object with property date
			// Else add object with property dateTime
			if (vm.allDay) {
				// save event startDate in var and covert to iso string
				// moment js assumes dates as isostrings
				var startDate = new Date(vm.startDate).toISOString(),
					endDate = new Date(vm.endDate).toISOString();
				// Timezone should be europe helsinki
				calendarEvent['start'] = {'date': moment(startDate).tz('Europe/Helsinki').format('YYYY-MM-DD')};
				calendarEvent['end'] = {'date': moment(endDate).tz('Europe/Helsinki').format('YYYY-MM-DD')};
			} else {
				var startTime = new Date(vm.startTime).toISOString(),
					endTime = new Date(vm.endTime).toISOString();
				calendarEvent['start'] = {'dateTime': moment(startTime).tz('Europe/Helsinki').format()};
				calendarEvent['end'] = {'dateTime': moment(endTime).tz('Europe/Helsinki').format()};
			}

			// calendarFactory creates the final event
			// Throws error if event could not be created
			calendarFactory.create(calendarEvent)
				.success(function(data) {
					handleSuccess(data);
				})
				.error(function(err) {
					handleError(err);
				})
				.finally(function() {
					clearForm();
				});
		};

		/**
		 * Handles errors from api
		 * Add error to session flash
		 * @param  {Object} Google Api return error
		 */
		function handleError(err) {
			$exceptionHandler(err);
			// clears flash message if session has a flash set
			vm.notification.error = "";
			vm.notification.error = flashService.show(err);
		}

		/**
		 * Handles success from api
		 * @param  {Object} Return object from google Api
		 */
		function handleSuccess(data) {
			// clears flash message if session has a flash set
			vm.notification.success = "";
			vm.notification.success = flashService.show("Your event was created successfully");
		}

		/**
		 * Clears the form manually and stop loading icon
		 * Bug* form.$setPristine(); should clear form automatically, but doesnt
		 */
		function clearForm() {
			vm.loading = false;
			vm.form.$setPristine();
			vm.title = "";
			vm.address = "";
			vm.city = "";
			vm.startDate = "";
			vm.endDate = "";
			vm.startTime = "";
			vm.endTime = "";
			vm.description = "";
			vm.attendees = [];
			vm.allDay = false;
			if (typeof vm.attendee.email !== 'undefined') { vm.attendee.email = ""; }
		}

	};


	angular.module('CalendarApp')

	.config(function($routeProvider) {
        $routeProvider.when('/create', {
            templateUrl: '/templates/create.html',
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