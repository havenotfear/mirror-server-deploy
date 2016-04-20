angular.module('dashboardConfig').controller('DashboardConfigHomeCtrl', function ($scope, GRID_OPTIONS, dashboardService) {

    var configHome = this;
    configHome.gridsterOpts = GRID_OPTIONS;
    var dashboard;
    var User = "SYSTEM";

    configHome.gridsterOpts.resizable = {
        enabled: true,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
        start: function (event, $element, widget) {
        }, // optional callback fired when resize is started,
        resize: function (event, $element, widget) {

        }, // optional callback fired when item is resized,
        stop: function (event, $element, widget) {
            _.debounce(saveDashboard(), 500);
        } // optional callback fired when item is finished resizing
    };
    configHome.gridsterOpts.draggable = {
        enabled: true, // whether dragging items is supported
        start: function (event, $element, widget) {
        }, // optional callback fired when drag is started,
        drag: function (event, $element, widget) {

        }, // optional callback fired when item is moved,
        stop: function (event, $element, widget) {
            _.debounce(saveDashboard(), 500);
        } // optional callback fired when item is finished dragging
    };

    dashboardService.connect(function (newDashboard) {
        if (newDashboard) {
            configHome.widgets = newDashboard.widgets;
            dashboard = newDashboard;
        }
    });

    $scope.$on("saveDashboard", function() {
        saveDashboard();
    });

    function saveDashboard() {
        dashboardService.saveDashboard(User, dashboard);
    }
});
