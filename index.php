<!DOCTYPE html>
<html lang="en" ng-app="CalendarApp">
<head>
	<meta charset="UTF-8">
	<title>Calendar App</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">
    <link rel="stylesheet" href="/css/style.min.css">
    <script src="https://cdn.firebase.com/js/client/2.2.7/firebase.js" defer></script>
	<script src="/js/vendor.min.js" defer></script>
    <script src="https://cdn.firebase.com/libs/angularfire/1.1.2/angularfire.min.js" defer></script>
	<script src="/js/app.min.js" defer></script>
</head>
<body>
<div class="content">
	<div ng-view></div>	
</div>
</body>
</html>