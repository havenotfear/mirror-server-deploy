angular.module('dashboard').directive('twitterWidget', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: "="
        },
        templateUrl: 'dashboard/directive/twitter-widget/twitter-widget.html',
        link: function (scope, element, attrs, fn) {

            var account = scope.widget.config[0].value;
            angular.element(document).ready(function () {
                element.find('.social-feed-container').socialfeed({
                    twitter: {
                        accounts: [account],                      //Array: Specify a list of accounts from which to pull tweets
                        limit: 1,                                   //Integer: max number of tweets to load
                        consumer_key: '6rBWJs5GtD221adYSeLVvAR4a',          //String: consumer key. make sure to have your app read-only
                        consumer_secret: 'e8RoSJvo6ToKsYrO5RnsQqHNQPmIiWIkmtCmuwSYuvAKcAUlel',//String: consumer secret key. make sure to have your app read-only
                    },
                    length: 400,                                     //Integer: For posts with text longer than this length, show an ellipsis.
                    show_media:false,                                //Boolean: if false, doesn't display any post images
                    update_period: 5000,                            //Integer: Number of seconds before social-feed will attempt to load new posts.
                    template_html:
                    "<div id='twitterTemplate' class='social-feed-element {{? !it.moderation_passed}}hidden{{?}}' dt-create='{{=it.dt_create}}' " +
                    "social-feed-id =" + "'{{=it.id}}'>" +
                    "    <div id='twitterContent' class='content'>" +
                    "        <a class='pull-left' href='{{=it.author_link}}' target='_blank'>" +
                    "            <img class='media-object' src='{{=it.author_picture}}'>" +
                    "        </a>" +
                    "        <div class='media-body'>" +
                    "            <p>" +
                    "                <i class='fa fa-{{=it.social_network}}'></i>" +
                    "                <span class='author-title'>{{=it.author_name}}</span>" +
                    "                <span class='muted pull-right'> {{=it.time_ago}}</span>" +
                    "            </p>" +
                    "            <div class='text-wrapper'>" +
                    "                <p class='social-feed-text'>{{=it.text}}</p>" +
                    "            </div>" +
                    "        </div>" +
                    "    </div>" +
                    "    {{=it.attachment}}" +
                    "</div>"
                    //String: Filename used to get the post template.
                });
            });

        }
    };
});
