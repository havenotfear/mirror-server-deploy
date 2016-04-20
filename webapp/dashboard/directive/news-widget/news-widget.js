angular.module('dashboard').directive('newsWidget', function (rssFeedService, $interval, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: "="
        },
        templateUrl: 'dashboard/directive/news-widget/news-widget.html',
        link: function (scope, element, attrs, fn) {

            scope.newsHeadline = [];
            var rowHeight = 80;
            var url = scope.widget.config[0].urlValue;

            function getFeed() {
                rssFeedService.parseFeed(url).then(function (res) {
                    scope.newsHeadline = res.data.responseData.feed.entries;
                    setupTicker();
                });
            }
            getFeed();
            $interval(function() {
                getFeed();
            }, 600000);

            var tt = element.find('.ticker-text');
            var width, containerwidth, left;

            function setupTicker() {
                width = getWidth();
                containerwidth = element.find('.ticker-container').width();
                left = containerwidth;
            }

            function getWidth() {
                var total = 0;
                element.find('.newsTick').each(function() {
                    total += $( this ).width();
                });
                return total;
            }

            function tick() {
                width = getWidth();
                if (--left < -width) {
                    left = containerwidth;
                }
                tt.css("margin-left", left + "px");
                $timeout(tick, 16);
            }
            tick();

        }
    };
});
