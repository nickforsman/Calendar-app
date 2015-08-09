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