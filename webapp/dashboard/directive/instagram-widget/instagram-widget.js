angular.module('dashboard').directive('instagramWidget', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: "="
        },
        templateUrl: 'dashboard/directive/instagram-widget/instagram-widget.html',
        link: function (scope, element, attrs, fn) {

            var accounts = scope.widget.config[0].value;
            var accessToken = scope.widget.config[0].accessToken;
            angular.element(document).ready(function () {
                element.find('.sf-container').socialfeed({
                    instagram: {
                        accounts: [accounts],  //Array: Specify a list of accounts from which to pull posts
                        limit: 1,                                    //Integer: max number of posts to load
                        client_id: 'abb65b2a24d54e0fbd8f65e8d6eb2cca',       //String: Instagram client id (optional if using access token)
                        access_token: " 2869041673.5b9e1e6.b2ffcdbb571b4d18a96be810eac4d295"//accessToken //String: Instagram access token
                    },
                    show_media: true,
                    template_html: '<div class="social-feed-element {{? !it.moderation_passed}}hidden{{?}}" dt-create="{{=it.dt_create}}" social-feed-id="{{=it.id}}">' +
                    '<div class="socialContent" style="justify-content: flex-start; align-items: center">' +
                    '<img class="media-object" src="{{=it.author_picture}}">' +
                    '<div class="socialContentName"><h2>{{=it.author_name}}</h2> <span class="muted socialTimeAgo"> {{=it.time_ago}}</span></div>' +
                    '</div><div class="img-container">' +
                    '{{=it.attachment}}</div>' +
                    '</div>'

                });
            });
        }
    };
});
