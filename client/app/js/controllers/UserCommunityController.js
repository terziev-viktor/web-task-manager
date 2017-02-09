
app.controller('UserCommunityController', ['$scope', '$location', '$routeParams', 'notification', 'statusCodeHandler', 'authorization',
    function ($scope, $location, $routeParams, notification, statusCodeHandler, authorization) {

        $scope.username = $routeParams.username;
        let statusHandler = statusCodeHandler($scope);

        $scope.inviteColleague = (username) => {
            $.ajax({
                method: 'POST',
                url: '/user/req/colleague',
                data: {
                    Username: username
                },
                statusCode: {
                    200: () => {
                        notification.success('Request sent to ' + username);
                    },
                    500: () => {
                        notification.error('Server Error');
                    },
                    400: () => {
                        console.log('bad post req to /user/req/colleague');
                    }
                }
            })
        }

        $.ajax({
            method: 'GET',
            url: '/tasks/todo/' + $routeParams.username,
            success: (data) => {
                data.tasks.forEach(function (element) {
                    element.priorityLow = element.Priority == 0;
                    element.priorityMed = element.Priority == 1;
                    element.priorityHigh = element.Priority == 2;
                    element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
                }, this);
                $scope.tasksTodo = data.tasks;
                $scope.$apply();
            },
            error: (err) => {
                console.log('error');
                console.log(err);
            },
            statusCode: statusHandler
        });

        $.ajax({
            method: 'GET',
            url: '/tasks/created/' + $routeParams.username,
            success: (data, stringStatus, xhr) => {
                data.tasks.forEach(function (element) {
                    element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
                }, this);
                $scope.tasksCreated = data.tasks;
                $scope.$apply();
            },
            statusCode: statusHandler
        });

        $.ajax({
            method: 'GET',
            url: '/user/employees/' + $routeParams.username,
            success: (data) => {
                console.log('/user/employees');
                console.log(data);
                $scope.employees = data;
                $scope.$apply();
            },
            statusCode: statusHandler
        });

        $.ajax({
            method: 'GET',
            url: '/user/managers/' + $routeParams.username,
            success: (data) => {
                $scope.managers = data;
                $scope.$apply();
            },
            statusCode: statusHandler
        });

        $scope.showTaskInfo = (id) => {
            console.log('showtaskinfo');
            console.log(id);

        }

    }]);
