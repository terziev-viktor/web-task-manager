app.controller('UserController',
    function ($scope, $location, $compile, notification, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr, ajax) {
        let statusHandler = statusCodeHandler($scope);

        $('#task-view').hide();
        $('#li-profile').show(300);
        $('#li-logout').show(300);
        $scope.hide_task_view = (el) => {
            $('#task-view').hide(300);
        }

        $scope.showContentPanel = (el) => {
            console.log(el);
            let task = el.task;
            task.PriorityStr = TaskPrioritiesStr[task.Priority];
            $.get('../templates/taskContentPanel.html', (tmpl) => {
                var rendered = Mustache.render(tmpl, task);
                $('#modal-content').html(rendered);
                $('#modal-title').html(task.Title);
            });
        }

        function getCurrentUserInfo() {

            ajax.get('/user/req/colleague', statusHandler)
                .then((data) => {
                    console.log('/user/req/colleague');
                    console.log(data);
                    $scope.colleagueReqs = data;
                });

            ajax.get('/tasks/todo', statusHandler)
                .then((data) => {
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
                }, (err) => {
                    console.log('error');
                    console.log(err);
                });

            ajax.get('/tasks/created', statusHandler)
                .then((data) => {
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
                });
            let managersAndEmployeesStrings = [];
            ajax.get('/user/employees', statusHandler)
                .then((data) => {
                    data.forEach((el) => {
                        managersAndEmployeesStrings.push(el.Employee);
                    });
                    $scope.employees = data;
                    return ajax.get('/user/managers', statusHandler);
                })
                .then((data) => {
                    data.forEach((el) => {
                        managersAndEmployeesStrings.push(el.Manager);
                    });
                    $scope.managers = data;
                    return ajax.get('/user/colleagues', statusHandler);
                })
                .then((data) => {
                    $scope.managersAndEmployeesStrings = managersAndEmployeesStrings;
                    $scope.colleagues = data;
                });

            ajax.get('/user/req/manager', statusHandler)
                .then((data) => {
                    $scope.managersReq = data;
                });

            ajax.get('/user/req/employee', statusHandler)
                .then((data) => {
                    $scope.employeesReq = data;
                });

            $scope.acceptReqColleague = (username, $event) => {
                let reqData = {
                    Username: username
                };
                ajax.post('/user/colleagues', reqData, statusHandler)
                    .then(() => {
                        $($event.currentTarget).hide(200);
                    })
            };

            $scope.acceptReqEmployee = (username, $event) => {
                let reqData = {
                    Username: username
                };

                ajax.post('/user/employee', reqData, statusHandler)
                    .then(() => {
                        $($event.currentTarget).hide(200);
                    });
            }

            $scope.acceptReqManager = (username, $event) => {
                let reqData = {
                    Username: username
                };

                ajax.post('/user/manager', reqData, statusHandler)
                    .then(() => {
                        $($event.currentTarget).hide(200);
                    });
            }

            $scope.reqManager = (username) => {
                console.log(username);
                let reqData = {
                    Username: username
                };
                ajax.post('user/req/manager', reqData, statusHandler)
                    .then(() => {
                        console.log('post -> user/req/manager success');
                    });
            }

            $scope.reqEmployee = (username) => {
                console.log(username);
                let reqData = {
                    Username: username
                };
                ajax.post('user/req/employee', reqData, statusHandler)
                    .then(() => {
                        console.log('request sent');
                    });
            }

            $scope.removeManager = (username, $event) => {
                ajax.post('/user/manager?remove=' + username, {
                        Username: username
                    }, statusHandler)
                    .then((data) => {
                        $($event.currentTarget).hide(200);
                    });
            }

            $scope.removeEmployee = (username, $event) => {
                let reqdata = {
                    Username: username
                };
                ajax.post('/user/employee?remove=' + username, reqdata, statusHandler)
                    .then(() => {
                        $($event.currentTarget).hide(200);
                    });
            }
        }

        ajax.get('/user', statusHandler)
            .then((data) => {
                $scope.username = data;
                getCurrentUserInfo();
            }, (err) => {
                console.log('/user -> ne e lognat');
            });
    });