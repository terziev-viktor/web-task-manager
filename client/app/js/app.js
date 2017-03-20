const app = angular.module('app', ['ngRoute']);

app.constant('MaxDescLength', 35);
app.constant('MaxTitleLength', 15);
app.constant('TaskPrioritiesStr', [
    'Low',
    'Medium',
    'High'
]);
app.constant('colleaguesPageSize', 5);
app.constant('managersPageSize', 5);
app.constant('employeesPageSize', 5);
app.constant('createdTasksPageSize', 5);
app.constant('tasksToDoPageSize', 5);

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

    let htmlbodyHeightUpdate = () => {
        let height3 = $(window).height()
        let height1 = $('.nav').height() + 50
        height2 = $('.main').height()
        if (height2 > height3) {
            $('html').height(Math.max(height1, height3, height2) + 10);
            $('body').height(Math.max(height1, height3, height2) + 10);
        }
        else {
            $('html').height(Math.max(height1, height3, height2));
            $('body').height(Math.max(height1, height3, height2));
        }

    }
    $(document).ready(() => {
        htmlbodyHeightUpdate()
        $(window).resize(() => {
            htmlbodyHeightUpdate()
        });
        $(window).scroll(() => {
            height2 = $('.main').height()
            htmlbodyHeightUpdate()
        });
    });
});