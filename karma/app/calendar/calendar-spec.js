describe("Calendar Controller", function() {

	beforeEach(function() {
		module('CalendarApp');
	});

	beforeEach(inject(function($controller, $rootScope, calendarFactory, $httpBackend) {
		$scope = $rootScope.$new();
		this.$httpBackend = $httpBackend;
		$controller('CalendarController as calendar', {
		  $scope: $scope,
		  calendarFactory: calendarFactory,
		});
  	}));

	describe("List Events", function() {
		it("Should add all events to events array", function() {
			var dummyResponse = {
				"summary": 'asd',
				"description": 'ads',
				"defaultReminders": [
				    {'method': 'email', 'minutes': 24 * 60},
      				{'method': 'sms', 'minutes': 10}
				],
				"items": [
					{
					  "status": 'confirmed',
					  "summary": 'asd',
					  "description": 'das',
					  "location": 'da',
					  "start": {
					    "date": '2015-08-02T21:50:49Z',
					  },
					  "end": {
					    "date": '2015-08-09T21:50:49Z',
					  },
					}  
				]
			};
        	this.$httpBackend.whenGET("https://www.googleapis.com/calendar/v3/calendars/primary/events").respond(200, dummyResponse);
			$scope.calendar.eventSources = [[]];
			$scope.calendar.list();
			this.$httpBackend.flush();
			expect($scope.calendar.eventSources[0]).toContain(jasmine.objectContaining({title: "asd"}));
		});
	});

});