
app.controller('UserController', ['$scope', '$location', 'notification',
    function ($scope, $location, notification) {
        let statusHandler = {
            500: (xhr) => {
                $location.path('/err').replace();
                $scope.$apply();
            },
            401: (xhr) => {
                notification.info('Signup or login in to your profile first :-)');
                $location.path('/');
                $scope.$apply();
            },
            403: (xhr) => {
                notification.warning('Forbiddent symbols (\' -- ) used.');
            }
        }
        $('#task-view').hide();
        $('#li-profile').show(300);
        $('#li-logout').show(300);
        $scope.hide_task_view = (el) => {
            $('#task-view').hide(300);
        }

        $scope.showContentPanel = (el) => {
            let task = el.task;
            let view_tag_content = $('#task-view-content');
            view_tag_content.html('<ul>');
            view_tag_content.append('<li>Title:' + task.Title + '</li>');
            view_tag_content.append('<li>Description:' + task.Description + '</li>');
            view_tag_content.append('<li>Deadline:' + task.Deadline + '</li>');
            view_tag_content.append('<li>Priority:' + task.Priority + '</li>');
            view_tag_content.append('<li>Priority:' + task.Repeatability + '</li>');
            view_tag_content.append('</ul>');
             $('#task-view').show(300);
        }
        function getCurrentUserInfo() {
            $.ajax({
                method: 'GET',
                url: '/tasks/todo',
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
                    $scope.managers = data;
                    $scope.$apply();
                },
                statusCode: statusHandler
            });

            $.ajax({
                method: 'GET',
                url: '/user/req/manager',
                success: (data) => {
                    $scope.managersReq = data;
                    $scope.$apply();
                },
                statusCode: statusHandler
            });

            $.ajax({
                method: 'GET',
                url: '/user/req/employee',
                success: (data) => {
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
        }

        $scope.showTask = (taskId) => {
            // TODO: implement function: show full info ot task with given id
        }

         $.ajax({
            method: 'GET',
            url: '/user',
            success: (data) => {
                $scope.username = data;
                getCurrentUserInfo();
            },
            statusCode: statusHandler
        });
    }]);
