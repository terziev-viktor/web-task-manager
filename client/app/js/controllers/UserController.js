
app.controller('UserController', ['$scope', '$location', 'notification',
    function ($scope, $location, notification) {
        let taskPriorities = [
            'Low',
            'Medium',
            'High'
        ]
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
            task.PriorityStr = taskPriorities[task.Priority];
            let tmpl = $.get('../templates/task.html', (tmpl) => {
                var rendered = Mustache.render(tmpl, task);
                let view_tag_content = $('#task-view-content').html(rendered);
                $('#task-view').show(300);
                $scope.updateTask = (taskId) => {
                    console.log('4ep');
                    let task = {};
                    // task.Title = $('#inp-title').val();
                    // task.Description = $('#inp-description').val();
                    // task.Progress = $('#inp-progress').val();
                    // task.Deadlile = $('#inp-deadline').val();
                    // task.Priority = $('#inp-priority').val();
                    // console.log('task to update:');
                    // console.log(task);

                    // $.ajax({
                    //     method: 'POST',
                    //     url: '/task/' + taskId,
                    //     data: task,
                    //     success: (res) => {
                    //         console.log(res);
                    //     }
                    // });
                }
                $scope.$apply();
            });
        }



        function getCurrentUserInfo() {

            $.ajax({
                method: 'GET',
                url: '/user/req/colleague',
                success: (data) => {
                    $scope.colleagueReqs = data;
                }
            });

            $.ajax({
                method: 'GET',
                url: '/user/colleagues',
                success: (data) => {
                    $scope.colleagues = data;
                },
                statusCode: statusHandler
            });

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

            $scope.acceptReqColleague = (username) => {
                $.ajax({
                    method: 'POST',
                    url: '/user/colleague',
                    data: {
                        Username: username
                    },
                    success: (data) => {
                        notification.success('User ' + username + ' added to colleagues.');
                        console.log('success');
                    },
                    statusCode: statusHandler
                });
            };

            $scope.acceptReqEmployee = (username) => {
                $.ajax({
                    method: 'POST',
                    url: '/user/employee',
                    data: {
                        Username: username
                    },
                    success: (data) => {
                        notification.success('User ' + username + ' added to employees.');
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
                        notification.success('User ' + username + ' added to managers.');

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
