angular.module('dashboard').directive('weatherWidget', function ($timeout, weatherService, $interval) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: "="
        },
        templateUrl: 'dashboard/directive/weather-widget/weather-widget.html',
        link: function (scope, element, attrs, fn) {
            scope.TYPES = weatherService.TYPES;

            scope.iconType = "";

            function getZip() {
                return scope.widget.config[0].value;
            }

            function getForecast() {
                weatherService.get5DayWeather(getZip()).$promise.then(function (forecastData) {
                    scope.forecast = weatherService.parseForecast(forecastData, 3);
                });
            }

            function getWeather() {
                weatherService.getWeather(getZip()).$promise.then(function (currentWeather) {
                    if (currentWeather && currentWeather.main) {
                        scope.tempature = parseInt(currentWeather.main.temp) + "° F";
                        scope.city = currentWeather.name;
                        scope.hiLow = parseInt(currentWeather.main.temp_max) + "° / " + parseInt(currentWeather.main.temp_min) + "°";
                        scope.weather = currentWeather.weather[0];
                        scope.weatherDesc = scope.weather.description;
                    }
                    $timeout(getForecast, 2000);
                });
            }
            getWeather();
            $interval(getWeather, 1000000);
        }
    };
});
