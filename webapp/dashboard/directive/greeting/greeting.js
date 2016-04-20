angular.module('dashboard').directive('greeting', function(greetingService, $interval) {

	return {
		restrict: 'E',
		replace: true,
		scope: {
            widget: "="
		},
		templateUrl: 'dashboard/directive/greeting/greeting.html',
		link: function(scope, element, attrs, fn) {
            var name = scope.widget.config[0].value;
            var timeZone = scope.widget.config[1].value;
            var birthday = scope.widget.config[2].value;
            var currentTimeOfDay = null;

            function loadGreeting() {
                var greeting = greetingService.getGreeting(currentTimeOfDay, timeZone, name, birthday);
                if (greeting) {
                    scope.message = greeting.message;
                    currentTimeOfDay = greeting.currentTimeOfDay;
                }
            }
            loadGreeting();
            $interval(loadGreeting, 3600000);
		}
	};
});
