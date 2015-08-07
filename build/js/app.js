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

	function runblock($rootScope, $location, firebaseService, User) {
		$rootScope.logout = function() {
			firebaseService.logout();
		};
		
		$rootScope.isActiveNav = function(path) {
			return path == $location.path();
		};

		// e: event, n: next, c: current
		$rootScope.$on('$routeChangeStart', function(e, n, c) {
			if ( ! firebaseService.isLoggedIn()) {
				$location.path('/login');
			} else {
				var payload = firebaseService.isLoggedIn();
				User.name = payload.google.displayName;
				User.email = payload.google.email;
				User.profileImg = payload.google.profileImageURL;
				User.accessToken = payload.google.accessToken;
			}
		});	
	}
})();
;(function() {
	'use strict';

	var calendarFactory = function($http, User) {

        function list() {
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
			console.log(calendarEvent);
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
					vm.title = "";
					vm.address = "";
					vm.city = "";
					vm.startDate = "";
					vm.endDate = "";
					vm.startTime = "";
					vm.endTime = "";
					vm.attendee.email = "";
					vm.description = "";
					vm.attendees = [];
					vm.allDay = false;
					vm.form.$setPristine();
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
;(function() {
	'use strict';

	var LoginController = function(firebaseService, $location, $exceptionHandler) {
		var vm = this;

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
            templateUrl: 'src/app/login/login.html',
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
;(function() {
	'use strict';
	
	function firebaseService($location, FBURL, $firebaseAuth) {
		var ref = new Firebase(FBURL);
		var auth = $firebaseAuth(ref);

		this.isLoggedIn = function() {
            return ref.getAuth();
        };

        this.logout = function() {
        	ref.unauth();
        	$location.path('/login');
        };

		this.googleAuth = function() {
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
;(function() {
	'use strict';
	
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