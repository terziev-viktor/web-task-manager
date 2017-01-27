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
    
    $routeProvider.otherwise(
        { redirectTo: '/' }
    );
});