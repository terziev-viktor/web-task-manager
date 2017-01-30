
app.controller('UserCommunityController', ['$scope', '$location', '$routeParams', 'notification',
    function ($scope, $location, $routeParams, notification) {
        $scope.username = $routeParams.username;
        $scope.$apply();
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
                // $.ajax({
                //     method:'GET',
                //     url: '/task/comments',
                //     headers: {
                //         'taskId': id
                //     },
                //     success: (data) => {
                //         console.log('data in success');
                //         console.log(data);
                //         console.log(id);
                //         let divId = '#comments' + id;
                //         let comments = '';
                //         data.forEach((element) => {
                //             comments += '<div><p>' + element.Author + ' on ' + element.Date + '</p><br>';
                //             comments += '<p>' + element.Content + '</p><br></div>';
                //         });
                //         $(divId).append(comments);
                //     }
                // });
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
