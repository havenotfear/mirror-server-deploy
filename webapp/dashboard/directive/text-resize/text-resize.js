angular.module('dashboard').directive('textResize', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, fn) {
            var size = attrs.size;
            var textHeight = 1 * size;
            var parent = attrs.parent;
            scope.$watch
            (
                _.debounce(function () {
                    return element.parent().height();
                }),
                function (newValue, oldValue) {
                    textHeight = newValue * size;
                    if (textHeight !== 0) {
                        element.css("font-size", textHeight + "px");
                    }
                }
            );
        }
    };
});
