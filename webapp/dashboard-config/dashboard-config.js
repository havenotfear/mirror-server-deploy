angular.module('dashboardConfig', ['ui.bootstrap', 'ui.utils', 'ngRoute', 'ngAnimate', 'dashboard', 'magicMirror']);

angular.module('dashboardConfig').config(function ($routeProvider) {
    $routeProvider.when('/dashboardConfig/',
        {
            templateUrl: 'dashboard-config/partial/dashboard-config-home/dashboard-config-home.html'
        });
});
