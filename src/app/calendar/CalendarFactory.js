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