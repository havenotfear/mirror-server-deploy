angular.module('dashboard').controller('HomeCtrl',function($scope, WidgetTypes, GRID_OPTIONS, dashboardService){

    var home = this;

    home.widgets = [];
    home.dashboard = null;
    home.gridsterOpts = GRID_OPTIONS;

    dashboardService.connect(function(dashboard) {
        if(dashboard) {
            home.dashboard = dashboard;
            home.widgets = dashboard.widgets;
            $scope.$broadcast("widgetResize");
        }
    });

    $scope.$on("saveDashboard", function() {
        saveDashboard();
    });

    function saveDashboard() {
        dashboardService.saveDashboard(home.dashboard);
    }
});
