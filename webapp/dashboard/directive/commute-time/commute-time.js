angular.module('dashboard').directive('commuteTime', function($resource, commuteService, TEXT_SIZE, $interval, mapsDirectionService) {
    return {
		restrict: 'E',
		replace: true,
		scope: {
            widget: "="
		},
		templateUrl: 'dashboard/directive/commute-time/commute-time.html',
		link: function(scope, element, attrs, fn) {
            scope.TEXT_SIZE = TEXT_SIZE;
            scope.origin = scope.widget.config[0].value;
            scope.destination = scope.widget.config[1].value;
            if (scope.origin.formatted_address) {
                scope.origin = scope.origin.formatted_address;
            }
            if (scope.destination.formatted_address) {
                scope.destination = scope.destination.formatted_address;
            }
            scope.valid = true;



            function getCommute() {
                /*
                 Draw the map
                 */
                var directionsDisplay = null;
                mapsDirectionService.getMap($(element).find('.map')[0]).then(function(map) {
                    directionsDisplay = mapsDirectionService.directionsRenderer();
                    directionsDisplay.setMap(map);
                });
                commuteService.getCommuteObject(scope.origin, scope.destination).then(function(commuteTime) {
                    if (!commuteTime) {
                        scope.valid = false;
                    } else {
                        scope.travelTime = secondsToMinutes(commuteTime.seconds);
                        scope.traffic = secondsToMinutes(commuteTime.trafficSeconds);
                        scope.summary = commuteTime.summary;
                        var response = commuteTime.response;
                        var interval = $interval(function() {
                            if (directionsDisplay) {
                                directionsDisplay.setDirections(response);
                                $interval.cancel(interval);
                            }
                        }, 500);
                    }
                });
            }

            getCommute();
            $interval(getCommute, 1800000); //get current commute every 30 minutes
            scope.$on("widgetResize", getCommute);
            function secondsToMinutes(time) {
                if (time) {
                    return Math.floor(time / 60);
                }
                return null;
            }


		}
	};
});
