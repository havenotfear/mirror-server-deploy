angular.module('dashboard').directive('weatherIcon', function(weatherService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
            weather: "=",
            size: "="
		},
		templateUrl: 'dashboard/directive/weather-icon/weather-icon.html',
		link: function(scope, element, attrs, fn) {
            scope.TYPES = weatherService.TYPES;
            if (scope.weather) {
                scope.currentType = scope.weather.main;
                scope.showSun = false;
                scope.day = true;

                if (scope.weather.icon && scope.weather.icon.indexOf("n") > -1) {
                    scope.day = false;
                }
                if (scope.currentType === scope.TYPES.Drizzle ||
                    (scope.currentType === scope.TYPES.Rain && scope.weatherDesc === "light rain")) {
                    scope.showSun = true;
                }

                if (scope.currentType === scope.TYPES.Clouds && scope.weatherDesc === "few clouds") {
                    scope.showSun = true;
                }

                if (scope.currentType === scope.TYPES.Extreme) {
                    scope.currentType = scope.TYPES.Thunderstorm;
                    if (scope.weatherDesc === "cold" || scope.weatherDesc === "hot" ||
                        scope.weatherDesc === "windy") {
                        scope.currentType = scope.TYPES.Clear;
                    }
                    if (scope.weatherDesc === "hail") {
                        scope.currentType = scope.TYPES.Rain;
                    }
                }
                if (scope.currentType === scope.TYPES.Additional) {
                    scope.currentType = scope.TYPES.Clear;
                    if (scope.weatherDesc === "storm" || scope.weatherDesc === "violent storm" ||
                        scope.weatherDesc === "hurricane") {
                        scope.currentType = scope.TYPES.Rain;
                    }
                }
            }
		}
	};
});
