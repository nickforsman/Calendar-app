module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
		  	'bower_components/angular/angular.js',
  			'bower_components/angular-mocks/angular-mocks.js',
  			'bower_components/angular-route/angular-route.js',
  			'bower_components/angular-ui-calendar/src/calendar.js',
  			'https://cdn.firebase.com/js/client/2.2.7/firebase.js',
			'src/**/*.js',
			'https://cdn.firebase.com/libs/angularfire/1.1.2/angularfire.min.js',
			'karma/**/*.js'
		],
		reporters: ['progress'],
		port: 9876,
		colors:true,
	});
};