angular.module('dashboard').directive('dashboardWidget', function(WidgetTypes, screenSize) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
            widget: "="
		},
		templateUrl: 'dashboard/directive/dashboard-widget/dashboard-widget.html',
		link: function(scope, element, attrs, fn) {
            scope.WidgetTypes = WidgetTypes;
            scope.desktop = screenSize.is('md, lg');
            scope.mobile = screenSize.is('xs, sm');
		}
	};
});
