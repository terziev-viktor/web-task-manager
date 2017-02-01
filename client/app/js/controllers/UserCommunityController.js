
app.controller('UserCommunityController', ['$scope', '$location', '$routeParams', 'notification',
    function ($scope, $location, $routeParams, notification) {
        $scope.username = $routeParams.username;
        console.log('User community');
        let statusHandler = {
            500: (xhr) => {
                $location.path('/err').replace();
                $scope.$apply();
            },
            401: (xhr) => {
                notification.info('Signup or login in to your profile first :-)');
                $location.path('/');
                $scope.$apply();
            }
        }

        function getUserCommunityInfo() {
            $.ajax({
                method: 'GET',
                url: '/tasks/todo/' + $routeParams.username,
                success: (data) => {
                    data.tasks.forEach(function (element) {
                        element.priorityLow = element.Priority == 0;
                        element.priorityMed = element.Priority == 1;
                        element.priorityHigh = element.Priority == 2;
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

            $scope.$apply();
        }

         $.ajax({
            method: 'GET',
            url: '/user',
            success: (data) => {
                getUserCommunityInfo();
            },
            statusCode: statusHandler
        });
    }]);
