describe("Create Controller", function() {

	beforeEach(function() {
		module('CalendarApp');
	});

	beforeEach(inject(function($controller, $rootScope, calendarFactory, $httpBackend) {
		$scope = $rootScope.$new();
		this.$httpBackend = $httpBackend;
		$controller('CreateController as create', {
		  $scope: $scope,
		  calendarFactory: calendarFactory,
		});
  	}));

	describe("Attendee functionality", function() {
		it("Should add guest to attendee list", function() {
			$scope.create.attendee = {
				email: ''
			};

			$scope.create.addAttendee('boris');
			expect($scope.create.attendees).toContain({email: 'boris'});
		});

		it("Should remove guest from attendee list", function() {
			$scope.create.attendee = {
				email: 'niclas',
			};
			
			$scope.create.removeAttendee('niclas');
			expect($scope.create.attendees).toEqual([]);
		});
	});

	describe("Create Event functionality", function() {
		it("Should add an event to calendar", function() {
			$scope.create.allDay = true;
			$scope.create.startDate = '2015-08-02';
			$scope.create.endDate = '2015-08-09';
			var dummyEvent = {
			  'summary': 'asd',
			  'location': 'da' + ', ' + 'bla',
			  'description': 'lol',
			  'attendees': [],
			  'reminders': {
				'useDefault': false,
			    'overrides': [
			      {'method': 'email', 'minutes': 24 * 60},
			      {'method': 'sms', 'minutes': 10}
			    ]
			  }
			};
			this.$httpBackend.whenPOST("https://www.googleapis.com/calendar/v3/calendars/primary/events").respond(200, dummyEvent);
			$scope.create.createEvent();
			this.$httpBackend.flush();
		});
	});
});