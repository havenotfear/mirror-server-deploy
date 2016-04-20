angular.module('magicMirror').directive('todoChecklist', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
            widget: "="
		},
		templateUrl: 'dashboard/directive/todo-checklist/todo-checklist.html',
		link: function(scope, element, attrs, fn) {

		}
	};
});
