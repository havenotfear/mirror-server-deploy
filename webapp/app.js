angular.module('magicMirror', ['ui.bootstrap', 'ui.utils', 'ngRoute', 'ngAnimate', 'dashboard', 'ngWebSocket', 'dashboardConfig', 'matchMedia', 'LocalStorageModule', 'angular-google-gapi']);

angular.module('magicMirror').config(function($routeProvider, localStorageServiceProvider, $httpProvider) {
    $routeProvider.otherwise({redirectTo:'/home'});
    localStorageServiceProvider.setStorageType('mirrorMirrorSessionStorage');
    $httpProvider.defaults.useXDomain = true;
});

angular.module('magicMirror').run(function($rootScope, $window, CALENDAR_CLIENT) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
});
