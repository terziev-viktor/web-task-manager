app.controller('UserCurrentTasksController',
    function ($scope, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr, ajax) {
        let statusHandler = statusCodeHandler($scope),
            createdTasksPage = 0,
            tasksToDoPage = 0,
            createdTasksPageSize = 4,
            tasksToDoPageSize = 1,
            tasksCreatedCount, tasksToDoCount;
        $('.to-show').slideDown("slow");
        $scope.tasksTodo = {
            display: 'loading',
            data: []
        };

        $scope.tasksCreated = {
            display: 'loading',
            data: []
        };

        $scope.showContentPanel = (el) => {
            console.log(el);
            let task = el.task;
            task.DeadlineFormatted = new Date(task.Deadline).toLocaleString();
            task.PriorityStr = TaskPrioritiesStr[task.Priority];
            $.get('../../templates/taskContentPanel.html', (tmpl) => {
                var rendered = Mustache.render(tmpl, task);
                $('#modal-content').html(rendered);
                $('#modal-title').html(task.Title);
            });
        }

        ajax.get('/tasks/todo?getCount=true', statusHandler)
            .then((data) => {
                console.log('////////////////////');
                console.log(data);
                $scope.taskTodoCount = data.Count;
                tasksToDoCount = data.Count;
            });

        ajax.get('/tasks/created?getCount=true', statusHandler)
            .then((data) => {
                console.log('////////////////////');
                console.log(data);
                $scope.taskCreatedCount = data.Count;
                tasksCreatedCount = data.Count;
            });

        function getTasksToDo(from, size) {
            ajax.get('/tasks/todo?from=' + from + "&size=" + size, statusHandler)
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
                    let d = data.tasks.length > 0 ? 'all' : 'none';
                    $scope.tasksTodo = {
                        display: d,
                        data: data.tasks
                    };
                }, (err) => {
                    console.log('error');
                    console.log(err);
                });
        }

        function getTasksCreated(from, size) {
            ajax.get('/tasks/created?from=' + from + '&size=' + size, statusHandler)
                .then((data) => {
                    console.log('tasks/created?from&to')
                    console.log(data);
                    data.tasks.forEach(function (element) {
                        element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
                        if (element.Description.length > MaxDescLength) {
                            element.Description = element.Description.substring(0, MaxDescLength) + '...';
                        }
                        if (element.Title.length > MaxTitleLength) {
                            element.Title = element.Title.substring(0, MaxTitleLength) + '...';
                        }
                    }, this);
                    let d = data.tasks.length > 0 ? 'all' : 'none';

                    $scope.tasksCreated = {
                        display: d,
                        data: data.tasks
                    };
                });
        }

        getTasksCreated(createdTasksPage + 1, createdTasksPageSize);
        getTasksToDo(tasksToDoPage + 1, tasksToDoPageSize);

        $scope.nextTasksCreated = () => {
            createdTasksPage += 1;
            let from = createdTasksPage * createdTasksPageSize + 1;
            if (from > tasksCreatedCount) {
                createdTasksPage -= 1;
                return;
            }
            $('#panel-created-tasks').slideUp("slow", () => {
                getTasksCreated(from, createdTasksPageSize);
                $('#current-page-tasks-created').val(createdTasksPage + 1);
                $('#panel-created-tasks').slideDown("slow");
            });
        }

        $scope.previousTasksCreated = () => {
            createdTasksPage -= 1;
            if (createdTasksPage < 0) {
                createdTasksPage = 0;
                return;
            }
            $('#panel-created-tasks').slideUp("slow", () => {
                getTasksCreated(createdTasksPage * createdTasksPageSize + 1, createdTasksPageSize);
                $('#current-page-tasks-created').val(createdTasksPage + 1);
                $('#panel-created-tasks').slideDown("slow");
            });
        }

        $scope.previousTasksToDo = () => {
            tasksToDoPage -= 1;
            if (tasksToDoPage < 0) {
                tasksToDoPage = 0;
                return;
            }
            $('#panel-todo-tasks').slideUp("slow", () => {
                getTasksToDo(tasksToDoPage * tasksToDoPageSize, tasksToDoPageSize);
                $('#current-page-tasks-todo').val(tasksToDoPage + 1);
                $('#panel-todo-tasks').slideDown("slow");
            });
        }

        $scope.nextTasksToDo = () => {
            tasksToDoPage += 1;
            let from = tasksToDoPage * tasksToDoPageSize + 1;
            if (from > tasksToDoCount) {
                tasksToDoPage -= 1;
                return;
            }
            $('#panel-todo-tasks').slideUp("slow", () => {
                getTasksToDo(from, tasksToDoPageSize);
                $('#current-page-tasks-todo').val(tasksToDoPage + 1);
                $('#panel-todo-tasks').slideDown("slow");
            });
        }
    });