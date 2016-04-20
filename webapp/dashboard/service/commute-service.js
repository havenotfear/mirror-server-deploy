angular.module('dashboard').factory('commuteService', function (localStorageService, $q, $window, mapsDirectionService) {


    var avgArrayKey = "averageTimeArray";
    var GetAverageAfter = 10;
    var MaxCommuteStore = 240;

    var commuteService = {

        getCommuteObject: function (origin, destination) {
            var defer = $q.defer();
            mapsDirectionService.route(
                origin,
                destination,
                function (result) {
                    try {
                        if (result.routes && result.routes.length > 0 && result.routes[0].legs && result.routes[0].legs.length > 0) {
                            var route = result.routes[0];
                            var summary = route.summary;
                            var legs = route.legs[0];
                            var seconds = legs.duration.value;
                            var avgTimeArray = localStorageService.get(avgArrayKey);
                            if (!avgTimeArray) {
                                avgTimeArray = [];
                            }
                            avgTimeArray.push(seconds);
                            if (avgTimeArray.length > MaxCommuteStore) {
                                avgTimeArray.shift();
                            }
                            var averageSeconds;
                            if (avgTimeArray.length > GetAverageAfter) {
                                averageSeconds = _.reduce(avgTimeArray, function (memo, num) {
                                        return memo + num;
                                    }, 0) / (avgTimeArray.length === 0 ? 1 : avgTimeArray.length);
                            }
                            var trafficSeconds;
                            if (averageSeconds && seconds > averageSeconds) {
                                trafficSeconds = seconds - averageSeconds;
                                if (trafficSeconds < 60) {
                                    trafficSeconds = 0;
                                }
                            }
                            defer.resolve({
                                averageSeconds: averageSeconds,
                                seconds: seconds,
                                trafficSeconds: trafficSeconds,
                                summary: summary,
                                response: result
                            });
                        } else {
                            defer.reject(false);
                        }
                    } catch (exception) {
                        defer.reject(false);
                    }
                });
            return defer.promise;

        }
    };

    return commuteService;
});
