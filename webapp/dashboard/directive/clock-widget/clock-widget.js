angular.module('dashboard').directive('clockWidget', function ($interval, screenSize, $http, $window, TEXT_SIZE, timeService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: "="
        },
        templateUrl: 'dashboard/directive/clock-widget/clock-widget.html',
        link: function (scope, element, attrs, fn) {
            scope.TEXT_SIZE = TEXT_SIZE;

            function getTime(message) {
                var dateTime = timeService.getTime(getZone());
                scope.date = dateTime.format("dddd, MMMM Do");
                scope.time = dateTime.format("h : mm : ss");
                scope.timeAMPM = dateTime.format("A");
            }

            function getZone() {
                return scope.widget.config[0].value;
            }

            getTime();
            $interval(getTime, 1000);
        }
    };
});
