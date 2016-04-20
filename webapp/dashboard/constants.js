var WidgetTypes = {
    CLOCK: "clock",
    WEATHER: "weather",
    NEWS: "news",
    COMMUTE: "commute",
    TWITTER: "twitter",
    INSTAGRAM: "instagram",
    GREETING: "greeting",
    CALENDAR: "calendar",
    TODO: "todo",
    PINTREST: "pintrest"
};

angular.module('dashboard').constant('TimeOfDay', {
    MORNING: "MORNING",
    EVENING: "EVENING",
    NIGHT: "NIGHT"
}).constant('widgets', [
    {
        icon: "fa-clock-o",
        type: WidgetTypes.CLOCK,
        sizeX: 4,
        sizeY: 1,
        minSizeY: 1,
        minSizeX: 4
    },
    {
        icon: "fa-sun-o",
        type: WidgetTypes.WEATHER,
        sizeX: 3,
        sizeY: 2,
        minSizeY: 2,
        minSizeX: 3
    }
]).constant('WidgetTypes', WidgetTypes).constant('GRID_OPTIONS', {
    columns: 15, // the width of the grid, in columns
    pushing: false, // whether to push other items out of the way on move or resize
    floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    margins: [10, 10], // the pixel distance between each widget
    outerMargin: true, // whether margins apply to outer edges of the grid
    isMobile: false, // stacks the grid items if true
    mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
    mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    minColumns: 1, // the minimum columns the grid must have
    minRows: 2, // the minimum height of the grid, in rows
    maxRows: 100,
    defaultSizeX: 2, // the default width of a gridster item, if not specifed
    defaultSizeY: 2 // the default height of a gridster item, if not specifie
}).constant('WEATHER_API', 'eed5bdeff736210501812917f8890d3a')
    .constant("TEXT_SIZE", {SMALL: 0.1, MEDIUM: 0.2, LARGE: 0.4})
    .constant("MAPS_API_URL", "https://maps.googleapis.com/maps/api/js?callback=").constant("CALENDAR_CLIENT", "152667895264-jub257fqmqmldk84kabmrg8267ja4krm.apps.googleusercontent.com");
