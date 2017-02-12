
app.controller('UserController',
    function ($scope, $location, $compile, notification, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr) {
        let statusHandler = statusCodeHandler($scope);

        $('#task-view').hide();
        $('#li-profile').show(300);
        $('#li-logout').show(300);
        $scope.hide_task_view = (el) => {
            $('#task-view').hide(300);
        }

        $scope.showContentPanel = (el) => {
            let task = el.task;
            task.PriorityStr = TaskPrioritiesStr[task.Priority];
            let tmpl = $.get('../templates/taskContentPanel.html', (tmpl) => {
                var rendered = Mustache.render(tmpl, task);
                let view_tag_content = $('#task-view-content').html(rendered);
                $('#task-view').show(300);

                $scope.updateTask = (taskId) => {
                    // TODO Implement
                }
                $scope.$apply();
            });
        }

        function getCurrentUserInfo() {

            $.ajax({
                method: 'GET',
                url: '/user/req/colleague',
                success: (data) => {
                    console.log('/user/req/colleague');
                    console.log(data);
                    $scope.colleagueReqs = data;
                },
                statusCode: statusHandler
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
                        element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
                        if (element.Description.length >= 35) {
                            element.Description = element.Description.substring(0, 35) + '...';
                        }
                        if (element.Title.length > MaxTitleLength) {
                            element.Title = element.Title.substring(0, MaxTitleLength) + '...';
                        }
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
                    data.tasks.forEach(function (element) {
                        element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
                        if (element.Description.length > MaxDescLength) {
                            element.Description = element.Description.substring(0, MaxDescLength) + '...';
                        }
                        if (element.Title.length > MaxTitleLength) {
                            element.Title = element.Title.substring(0, MaxTitleLength) + '...';
                        }
                    }, this);
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

            $scope.acceptReqColleague = (username, $event) => {
                $($event.currentTarget).hide(200);

                $.ajax({
                    method: 'POST',
                    url: '/user/colleagues',
                    data: {
                        Username: username
                    },
                    statusCode: statusHandler
                });
            };

            $scope.acceptReqEmployee = (username, $event) => {
                $($event.currentTarget).hide(200);

                $.ajax({
                    method: 'POST',
                    url: '/user/employee',
                    data: {
                        Username: username
                    },
                    statusCode: statusHandler
                });
            }

            $scope.acceptReqManager = (username, $event) => {
                $($event.currentTarget).hide(200);

                $.ajax({
                    method: 'POST',
                    url: '/user/manager',
                    data: {
                        Username: username
                    },
                    statusCode: statusHandler
                });
            }

            $scope.reqManager = (username) => {
                console.log(username);
                $.ajax({
                    method: 'POST',
                    url: 'user/req/manager',
                    data: {
                        Username: username
                    },
                    statusCode: statusHandler
                });
            }

            $scope.reqEmployee = (username) => {
                console.log(username);
                $.ajax({
                    method: 'POST',
                    url: 'user/req/manager',
                    data: {
                        Username: username
                    },
                    statusCode: statusHandler
                });
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
    });
