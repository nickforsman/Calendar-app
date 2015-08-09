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