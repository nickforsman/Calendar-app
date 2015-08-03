;(function() {
	'use strict';
	angular.module('CalendarApp', [
		'ngRoute',
        'firebase',
	])

	.run(function($rootScope, $location, firebaseService) {
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
			} 
		});	
	})

	.config(function($routeProvider) {
		$routeProvider.otherwise({ redirectTo: '/login' });
	});
})();
;(function() {
	'use strict';

	var Calendar = function() {

		var directive = {
			controller: controller,
			controllerAs: 'calendar-widget',
			link: link,
			restrict: 'E',
			scope: {
				date: '=',
			},
			templateUrl: 'src/app/calendar/partial/calendar-template.html'
		};

		function controller() {}

		function link(scope, element, attributes, controller) {}

		return directive;
	};

	angular.module('CalendarApp')
		.directive('calendar', Calendar);
})();
;(function() {
	'use strict';

	var calendarFactory = function($http, User) {

        function list() {
            $http.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', { 
                headers : {
                    'Authorization': 'Bearer ' + User.accessToken 
                } 
            })
            .success(function(data) {
                console.log(data);
            }).error(function(error) {
                console.log(error);
            });
        }

        function create(event) {
            $http.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', event, {
                headers : {
                    'Authorization': 'Bearer ' + User.accessToken 
                }
            })
            .success(function(payload) {
                console.log(payload);
            })
            .error(function(err) {
                console.log(err);
            });
        }
        
        var calendar = {
            list: list,
            create: create
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

	var CalendarController = function(firebaseService, calendarFactory, User) {
		var vm = this;

		vm.init = function() {
			vm.list();
			vm.date = Date.now();
		};
		
		vm.list = function() {
			calendarFactory.list();
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
		'firebaseService',
		'calendarFactory',
		'User',
		CalendarController
	]);
})();
;(function() {
	'use strict';

	var CreateController = function($scope, firebaseService, calendarFactory) {
		var vm = this;
		vm.attendees = [];
		
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
			var calendarEvent = {
				'summary': vm.title,
				  'location': vm.address + ', ' + vm.city,
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
			//calendarFactory.create(calendarEvent);
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
;(function() {
	'use strict';

	var LoginController = function(firebaseService, $location, $rootScope) {
		var vm = this;

		vm.login = function() {
			firebaseService.googleAuth().then(function(payload) {
				$location.path('/calendar');
			}, function(error) {
				console.log(error);
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
		'$rootScope',
        LoginController
    ]);
})();
;(function() {
	'use strict';
	
	function firebaseService($location, FBURL, $firebaseAuth, User) {
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
				User.name = payload.google.displayName;
				User.email = payload.google.email;
				User.profileImg = payload.google.profileImageURL;
				User.accessToken = payload.google.accessToken;
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
        'User',
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
	
	angular.module('CalendarApp')
		.constant('User', {
			name: '',
			email: '',
			profileImg: '',
			accessToken: ''
		});

})();