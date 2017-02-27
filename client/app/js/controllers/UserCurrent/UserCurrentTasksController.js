app.controller('UserCurrentTasksController',
    function ($scope, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr, ajax) {
        let statusHandler = statusCodeHandler($scope),
            createdTasksPage = 0,
            createdTasksPageSize = 4,
            tasksCreatedCount;
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
                $scope.taskTodoCount = data.count.Count;
            });

        ajax.get('/tasks/created?getCount=true', statusHandler)
            .then((data) => {
                $scope.taskCreatedCount = data.count.Count;
                tasksCreatedCount = data.count.Count;
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
                let d = data.tasks.length > 0 ? 'all' : 'none';
                $scope.tasksTodo = {
                    display: d,
                    data: data.tasks
                };
            }, (err) => {
                console.log('error');
                console.log(err);
            });

        function getTasksCreated(from, to) {
            ajax.get('/tasks/created?from=' + from + '&to=' + to, statusHandler)
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
        $scope.nextTasksCreated = () => {
            createdTasksPage += 1;
            if(createdTasksPage * createdTasksPageSize + 1 > tasksCreatedCount) {
                createdTasksPage -= 1;
                return;
            }
            getTasksCreated(createdTasksPage * createdTasksPageSize + 1, createdTasksPageSize);
            $('#current-page-tasks-created').val(createdTasksPage + 1);
        }

        $scope.previousTasksCreated = () => {
            createdTasksPage -= 1;
            if(createdTasksPage < 0) {
                createdTasksPage = 0;
                return;
            }
            getTasksCreated(createdTasksPage * createdTasksPageSize + 1, createdTasksPageSize);
            $('#current-page-tasks-created').val(createdTasksPage + 1);
            
        }
    });