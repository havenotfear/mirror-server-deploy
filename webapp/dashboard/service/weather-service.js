angular.module('dashboard').factory('weatherService', function (WEATHER_API, $resource) {

    var weatherResource = $resource("http://api.openweathermap.org/data/2.5/weather?zip=:zip,us&units=imperial&appid=" + WEATHER_API);
    var weather5DayResource = $resource("http://api.openweathermap.org/data/2.5/forecast?q=:zip,us&units=imperial&appid=" + WEATHER_API);

    function filterFunction(element) {
        return moment.unix(element.dt).startOf('day').isSame(this.day.utc());
    }

    function getMostWeather(weather, currentIndex) {
        if (weather.length > this.topCount) {
            this.position = currentIndex;
            this.topCount = weather.length;
        }
    }

    function returnName(main) {
        return main;
    }

    var weatherService = {
        TYPES: {
            Thunderstorm: "Thunderstorm",
            Drizzle: "Drizzle",
            Rain: "Rain",
            Snow: "Snow",
            Atmosphere: "Atmosphere",
            Fog: "Fog",
            Clear: "Clear",
            Clouds: "Clouds",
            Extreme: "Extreme",
            Additional: "Additional",
            Mist: "Mist"
        },
        getWeather: function (zip) {
            return weatherResource.get({"zip": zip});
        },
        get5DayWeather: function (zip) {
            return weather5DayResource.get({"zip": zip});
        },
        parseForecast: function (data, numOfDays) {
            var weatherElements = data.list;
            var forecast = [];
            for (var i = 0; i < numOfDays; i++) {
                var day = moment().add(i, 'days').startOf('day');
                var dayObject = {
                    day: day
                };
                var daysElements = _.filter(weatherElements, filterFunction, dayObject);
                var maxTemp = _.max(_.pluck(_.pluck(daysElements, "main"), "temp_max"));
                var minTemp = _.min(_.pluck(_.pluck(daysElements, "main"), "temp_min"));
                var weatherList = _.groupBy(_.pluck(_.flatten(_.pluck(daysElements, "weather")), "main"), returnName);
                var weatherObject = {
                    topCount: 0,
                    position: 0
                };
                _.each(weatherList, getMostWeather, weatherObject);

                console.log("Weather: " + JSON.stringify(weatherList));

                forecast.push({
                    date: day.format('dddd'),
                    minTemp: parseInt(minTemp),
                    maxTemp: parseInt(maxTemp),
                    weather: {
                        main: weatherList[weatherObject.position][0]
                    }
                });
            }
            return forecast;
        }
    };
    return weatherService;
});
