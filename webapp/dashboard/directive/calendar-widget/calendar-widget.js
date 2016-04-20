angular.module('magicMirror').directive('calendarWidget', function (GAuth, GApi, CALENDAR_CLIENT, googleAuthService, $interval, $http, $rootScope) {

    var timeMin = "";
    var calendarId = "primary";
    var maxResults = "5";
    var calendarEventUrl = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events";

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: "="
        },
        templateUrl: 'dashboard/directive/calendar-widget/calendar-widget.html',
        link: function (scope, element, attrs, fn) {
            var code = scope.widget.config[0].code;
            var refreshToken = scope.widget.config[0].refreshToken;
            var accessToken = "";

            function getAccessToken() {
                function getToken() {
                    googleAuthService.getAccessToken(refreshToken).then(function (access_token) {
                        accessToken = access_token;
                        getEvents();
                    });
                }
                getToken();
                $interval(getToken, 3600000);
            }

            if (!refreshToken) {
                googleAuthService.getRefreshToken(code).then(function (refresh_token) {
                    refreshToken = refresh_token;
                    scope.widget.config[0].refreshToken = refreshToken;
                    $rootScope.$broadcast("saveDashboard");
                    getAccessToken();
                });
            } else {
                getAccessToken();
            }

            scope.events = [];

            function getEvents() {
                $http({
                    url: calendarEventUrl,
                    method: "GET",
                    params: {
                        access_token: accessToken,
                        maxResults: maxResults,
                        timeMin: moment().toISOString(),
                        timeMax: moment().endOf('month').toISOString(),
                        singleEvents: "true"
                    }
                }).then(function (response) {
                    scope.events = _.sortBy(response.data.items, function (event) {
                        if (event.start.date) {
                            return moment(event.start.date).unix();
                        } else if (event.start.dateTime) {
                            return moment(event.start.dateTime).unix();
                        }
                    });
                });
            }

        }
    };
});
