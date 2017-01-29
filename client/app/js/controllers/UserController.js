

app.controller('UserController', ['$scope', '$location',
    function ($scope, $location) {
        let tasksTodo;
        let statusHandler = {
            500: (xhr) => {
                $location.path('/err').replace();
                $scope.$apply();
            },
            401: (xhr) => {
                //notification.alert('Signup or login in to your profile first :-)');
                $location.path('/').replace();
                $scope.$apply();
            }
        }

        $.ajax({
            method: 'GET',
            url: '/tasks/todo',
            success: (data) => {
                tasksTodo = data.tasks;
                tasksTodo.forEach(function (element) {
                    element.priorityLow = element.Priority == 0;
                    element.priorityMed = element.Priority == 1;
                    element.priorityHigh = element.Priority == 2;
                }, this);
                $scope.tasksTodo = tasksTodo;
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
            url: '/tasks/created',
            success: (data, stringStatus, xhr) => {
                $scope.tasksCreated = data.tasks;
                $scope.$apply();
            },
            statusCode: statusHandler
        });

        $.ajax({
            method: 'GET',
            url: '/user/employees',
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
            url: '/user/managers',
            success: (data) => {
                console.log('user/managers');
                console.log(data);
                $scope.managers = data;
                $scope.$apply();
            },
            statusCode: statusHandler
        });

        $.ajax({
            method: 'GET',
            url: '/user/req/manager',
            success: (data) => {
                console.log('user/req/manager');
                console.log(data);
                $scope.managersReq = data;
                $scope.$apply();
            },
            statusCode: statusHandler
        });

        $.ajax({
            method: 'GET',
            url: '/user/req/employee',
            success: (data) => {
                console.log('user/req/employee');
                console.log(data);
                $scope.employeesReq = data;
                $scope.$apply();
            },
            statusCode: statusHandler
        });

        $scope.acceptReqEmployee = (username) => {
            $.ajax({
                method: 'POST',
                url: '/user/employee',
                data: {
                    Username: username
                },
                success: (data) => {
                    // notify or something
                    console.log('success');
                },
                statusCode: statusHandler
            });
        }

        $scope.acceptReqManager = (username) => {
            $.ajax({
                method: 'POST',
                url: '/user/manager',
                data: {
                    Username: username
                },
                success: (data) => {
                    // notify or something
                    console.log('success');
                },
                statusCode: statusHandler
            });
        }

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
    }]);
