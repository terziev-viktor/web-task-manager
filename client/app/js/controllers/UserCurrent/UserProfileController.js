app.controller('UserProfileController',
    function ($scope, $location, $compile, notification, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr, ajax, navbarHandler) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').slideDown("slow");
        $scope.fullname = sessionStorage['fullname'];
        $scope.username = sessionStorage['currentUser'];
        navbarHandler.handle();
    });