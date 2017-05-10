const app = angular.module('app', ['ngRoute', 'angularFileUpload']);

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
app.constant('loadingHtml', '<button class="btn btn-default btn-lg" style="border: none;"><i class="fa fa-circle-o-notch fa-spin"></i> Loading</button>');

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    // current user's profle
    $routeProvider.when('/', {
        templateUrl: 'app/templates/home.html',
        controller: 'HomeCtrl'
    });

    // current user's tasks
    $routeProvider.when('/tasks', {
        templateUrl: 'app/templates/userCurrentTasks.html',
        controller: 'TasksCtrl'
    });

    // current user's community
    $routeProvider.when('/community', {
        templateUrl: 'app/templates/userCurrentCommunity.html',
        controller: 'CommunityCtrl'
    });

    // current user's requests
    $routeProvider.when('/requests', {
        templateUrl: 'app/templates/userCurrentRequests.html',
        controller: 'RequestsCtrl'
    });

    // current user creating a new task
    $routeProvider.when('/newTask', {
        templateUrl: 'app/templates/newTask.html',
        controller: 'NewTaskCtrl'
    });

    // guest at user's profile
    $routeProvider.when('/user/:username', {
        templateUrl: 'app/templates/userCommunity.html',
        controller: 'UserCommunityCtrl'
    });

    // user's created task
    $routeProvider.when('/task/:taskId', {
        templateUrl: 'app/templates/task.html',
        controller: 'TaskCtrl'
    });

    // error page. TODO: Implement
    $routeProvider.when('/err', {
        templateUrl: 'app/templates/error.html'
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