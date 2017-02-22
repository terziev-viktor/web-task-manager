app.controller('UserProfileController',
    function ($scope, $location, $compile, notification, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr, ajax) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').show(400, 'linear');
    });