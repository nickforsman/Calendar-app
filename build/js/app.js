;(function() {
	'use strict';
	angular.module('CalendarApp', [
		'ngRoute',
        'firebase',
        'ui.calendar'
	])

	.run(['$rootScope', '$location', 'firebaseService', 'User', runblock])

	.config(function($routeProvider) {
		$routeProvider.otherwise({ redirectTo: '/login' });
	});

	/**
	 * Run block for appilcation
	 * @param  {Object} Angular $rootScope
	 * @param  {Object} Angular $location
	 * @param  {Object} FirebaseService
	 * @param  {Object} User Constant
	 */
	function runblock($rootScope, $location, firebaseService, User) {
		// Logs user out
		// Logout should be globally available on all routes
		$rootScope.logout = function() {
			firebaseService.logout();
		};
		
		/**
		 * Adds active class to nav link
		 * @param  {String}
		 * @return {Boolean}
		 */
		$rootScope.isActiveNav = function(path) {
			return path == $location.path();
		};

		/**
		 * Functions runs on every route change event
		 * @param  {String} $routeChangeStart
		 * @param  {Object} Event
		 * @param  {Object} Next
		 * @param {Object} Current
		 */
		$rootScope.$on('$routeChangeStart', function(e, n, c) {
			// Checks if user is still logged in
			if ( ! firebaseService.isLoggedIn()) {
				$location.path('/login');
			} else {
				// If logged in add user data to user constant
				// This has potential security risks, firebase cannot save access token to current ref
				// Firebase save current user in an excluded firebase ref
				var payload = firebaseService.isLoggedIn();
				User.name = payload.google.displayName;
				User.email = payload.google.email;
				User.profileImg = payload.google.profileImageURL;
				User.accessToken = payload.google.accessToken;
			}
		});	
	}
})();
/**
 * Calendar Factory
 * @namespace Factories
 */
;(function() {
	'use strict';

    /**
     * CalendarFactory handles listing and creating events
     * @param  {Object} $http
     * @param  {Object} User constant
     * @return {Object} FactoryObject
     */
	var calendarFactory = function($http, User) {

        /**
         * List, gets all the events for the current user
         * @return {Object} $http promise
         */
        function list() {
            // store http result in variable
            var promise = $http.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', { 
                headers : {
                    'Authorization': 'Bearer ' + User.accessToken 
                } 
            });

            promise.success(function(data) {
                return data;
            });

            promise.error(function(error) {
                return error;
            });

            return promise;
        }

        /**
         * Creates a new event with the given object param
         * @param  {Object} Specific event object
         * @return {Object} $http promise
         */
        function create(event) {
            var promise = $http.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', event, {
                headers : {
                    'Authorization': 'Bearer ' + User.accessToken 
                }
            });
            
            promise.success(function(payload) {
                return payload;
            });

            promise.error(function(err) {
                return err;
            });

            return promise;
        }
        
        /**
         * Exposes the methods for this factory
         * @type {Object}
         */
        var calendar = {
            list: list,
            create: create,
        };

        return calendar;
	};

	angular.module('CalendarApp')

	.factory('calendarFactory', [
        '$http',
        'User',
        calendarFactory
    ]);
})();
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
/**
 * Login Controller
 * @namespace Controllers
 */
;(function() {
	'use strict';

	/**
	 * LoginController handles logging in and rendering login template
	 * @param {Object} firebaseService
	 * @param {Object} Angular $location object
	 * @param {Object} $exceptionHandler
	 */
	var LoginController = function(firebaseService, $location, $exceptionHandler) {
		// scope this keyword to vm
		var vm = this;

		/**
		 * Login, tries to log user in
		 * firebaseSerive handles google auth scopes
		 * @throws {Exception} If user could not be logged in
		 */
		vm.login = function() {
			firebaseService.googleAuth().then(function(payload) {
				$location.path('/calendar');
			}, function(err) {
				$exceptionHandler(err);
			});
		};

	};

	angular.module('CalendarApp')

	.config(function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/templates/login.html',
            controller: 'LoginController',
            controllerAs: 'login',
        });
	})

	.controller('LoginController', [
		'firebaseService',
		'$location',
		'$exceptionHandler',
        LoginController
    ]);
})();
/**
 * Firebase Service
 * @namespace Services
 */
;(function() {
	'use strict';
	
	/**
	 * FirebaseService handles login, logout, Oauth and checks if user is logged in
	 * @param  {Object} Angular $location object
	 * @param  {String} Firebase URL constant
	 * @param  {Object} FirebaseAuth object
	 */
	function firebaseService($location, FBURL, $firebaseAuth) {
		// Creates a new reference connection to firebase
		var ref = new Firebase(FBURL);
		// Creates a new firebase authentication reference
		var auth = $firebaseAuth(ref);

		/**
		 * Checks if user is loggedIn
		 * @return {Boolean && Object} 
		 */
		this.isLoggedIn = function() {
            return ref.getAuth();
        };

        /**
         * Logs user out of current auth reference
         * And redirects back to login
         */
        this.logout = function() {
        	ref.unauth();
        	$location.path('/login');
        };

        /**
         * Handles google authentication for the app
         * @return {Object} FirebaseAuth promise
         */
		this.googleAuth = function() {
			// Saves auth result in login var
			// Scope: scopes for google auth
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
;(function() {
	'use strict';
	
	angular.module('CalendarApp')
	.constant('FBURL', 'https://sweltering-torch-161.firebaseio.com');

})();
/**
 * FlashService
 * @namespace Factories
 */
;(function() {
	'use strict';
	
	/**
	 * Shows a flash message
	 * @return {Object}
	 */
	function flashService() {
		var show = function(message) {
			return message;
		};

		return {
			show: show,
		};
	}

	angular.module('CalendarApp')

	.factory('flashService', [
		flashService
	]);
})();
;(function() {
	'use strict';
	
	angular.module('CalendarApp')
		.constant('User', {
			name: '',
			email: '',
			profileImg: '',
			accessToken: ''
		});

})();