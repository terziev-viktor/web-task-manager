const app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    $routeProvider.when('/user', {
        templateUrl: 'templates/user.html',
        controller: 'UserController'
    });

    $routeProvider.when('/newTask', {
        templateUrl: '/templates/newTask.html',
        controller: 'NewTaskController'
    });

    $routeProvider.when('/user/community/:username', {
        templateUrl: '/templates/userCommunity.html',
        controller: 'UserCommunityController'
    });

    $routeProvider.otherwise(
        { redirectTo: '/' }
    );
});