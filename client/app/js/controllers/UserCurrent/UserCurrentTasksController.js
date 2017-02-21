app.controller('UserCurrentTasksController',
    function ($scope, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr, ajax) {
        $('#nav-tab-community').removeClass('active');
        $("#nav-tab-tasks").addClass('active');
        $("#nav-tab-requests").removeClass('active');
        let statusHandler = statusCodeHandler($scope);
        $scope.showContentPanel = (el) => {
            console.log(el);
            let task = el.task;
            task.PriorityStr = TaskPrioritiesStr[task.Priority];
            $.get('../../templates/taskContentPanel.html', (tmpl) => {
                var rendered = Mustache.render(tmpl, task);
                $('#modal-content').html(rendered);
                $('#modal-title').html(task.Title);
            });
        }

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
    });