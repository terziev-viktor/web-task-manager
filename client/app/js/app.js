const app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    // current user's profle
    $routeProvider.when('/user', {
        templateUrl: 'templates/User.html',
        controller: 'UserController'
    });

    $routeProvider.when('/newTask', {
        templateUrl: '/templates/newTask.html',
        controller: 'NewTaskController'
    });

    $routeProvider.when('/user/:username', {
        templateUrl: '/templates/userCommunity.html',
        controller: 'UserCommunityController'
    });

    $routeProvider.when('/task/:taskId', {
        templateUrl: '/templates/task.html',
        controller: 'TaskController'
    });

    $routeProvider.when('/err', {
        templateUrl: 'templates/error.html'
    });

    $routeProvider.otherwise(
        { redirectTo: '/' }
    );
});