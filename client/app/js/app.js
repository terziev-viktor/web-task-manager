const app = angular.module('app', ['ngRoute']);

app.constant('MaxDescLength', 35);
app.constant('MaxTitleLength', 15);
app.constant('TaskPrioritiesStr', [
    'Low',
    'Medium',
    'High'
]);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    // Home page: Login and signup
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    // current user's profle
    $routeProvider.when('/user', {
        templateUrl: 'templates/UserProfile.html',
        controller: 'UserProfileController'
    });

    // current user's tasks
    $routeProvider.when('/user/current/tasks', {
        templateUrl: 'templates/userCurrentTasks.html',
        controller: 'UserCurrentTasksController'
    });

    // current user's community
    $routeProvider.when('/user/current/community', {
        templateUrl: 'templates/userCurrentCommunity.html',
        controller: 'UserCurrentCommunityController'
    });

    // current user's requests
    $routeProvider.when('/user/current/requests', {
        templateUrl: 'templates/userCurrentRequests.html',
        controller: 'UserCurrentRequestsController'
    });

    // current user creating a new task
    $routeProvider.when('/newTask', {
        templateUrl: '/templates/newTask.html',
        controller: 'NewTaskController'
    });

    // guest at user's profile
    $routeProvider.when('/user/:username', {
        templateUrl: '/templates/userCommunity.html',
        controller: 'UserCommunityController'
    });

    // user's created task
    $routeProvider.when('/user/task/:taskId', {
        templateUrl: '/templates/userTask.html',
        controller: 'UserTaskController'
    });

    // see task with no ability to edit it
    $routeProvider.when('/task/:taskId', {
        templateUrl: '/templates/task.html',
        controller: 'TaskController'
    });

    // error page. TODO: Implement
    $routeProvider.when('/err', {
        templateUrl: 'templates/error.html'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

app.run(function ($rootScope, $location, authorization) {
    $rootScope.$on('$locationChangeStart', function (event) {
        if (!authorization.isLoggedIn()) {
            $location.path('/');
        }

    });
});