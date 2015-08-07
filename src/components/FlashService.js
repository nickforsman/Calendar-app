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