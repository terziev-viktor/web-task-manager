app.controller('UserCurrentTasksCtrl',
    function ($scope, $location, navbarHandler, statusCodeHandler, MaxDescLength, MaxTitleLength, TaskPrioritiesStr, ajax, $q, createdTasksPageSize, tasksToDoPageSize, loadingHtml) {
        let statusHandler = statusCodeHandler($scope),
            createdTasksPage = 0,
            tasksToDoPage = 0,
            tasksCreatedCount, tasksToDoCount;
        navbarHandler.handle($location.path());

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
            $('#modal-content').html(loadingHtml); // loading animation
            $('#modal-title').html('Loading');
            let task = el.task;
            task.DeadlineFormatted = new Date(task.Deadline).toLocaleString();
            task.PriorityStr = TaskPrioritiesStr[task.Priority];
            $.get('../../../templates/mustacheTemplates/taskContentPanel.html', (tmpl) => {
                let rendered = Mustache.render(tmpl, task);
                $('#modal-content').html(rendered);
                $('#modal-title').html(task.Title);
            });
        }

        ajax.get('/tasks/todo?getCount=true', statusHandler)
            .then((data) => {
                $scope.taskTodoCount = data.Count;
                tasksToDoCount = data.Count;
            });

        ajax.get('/tasks/created?getCount=true', statusHandler)
            .then((data) => {
                $scope.taskCreatedCount = data.Count;
                tasksCreatedCount = data.Count;
            });

        // sets a page for to-do list
        // args: from - start index, size - number of elements to get
        function getTasksToDo(from, size) {
            let deferred = $q.defer();

            ajax.get('/tasks/todo?from=' + from + "&size=" + size, statusHandler)
                .then((data) => {
                    data.tasks.forEach(function (element) {
                        element.priorityLow = element.Priority == 0;
                        element.priorityMed = element.Priority == 1;
                        element.priorityHigh = element.Priority == 2;
                        element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
                        element.DescriptionSliced = element.Description.substring(0, MaxDescLength) + '...';
                        element.TitleSliced = element.Title.substring(0, MaxTitleLength) + '...';
                    }, this);
                    let d = data.tasks.length > 0 ? 'all' : 'none';
                    $scope.tasksTodo = {
                        display: d,
                        data: data.tasks
                    };
                    deferred.resolve();
                }, (err) => {
                    console.log('error');
                    deferred.reject(err);
                    console.log(err);
                });

            return deferred.promise;
        }

        // sets a page for created tasks list
        // args: from - start index, size - number of elements to get
        function getTasksCreated(from, size) {
            let deferred = $q.defer();

            ajax.get('/tasks/created?from=' + from + '&size=' + size, statusHandler)
                .then((data) => {
                    data.tasks.forEach(function (element) {
                        element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
                        element.DescriptionSliced = element.Description.substring(0, MaxDescLength) + '...';
                        element.TitleSliced = element.Title.substring(0, MaxTitleLength) + '...';
                    }, this);
                    let d = data.tasks.length > 0 ? 'all' : 'none';

                    $scope.tasksCreated = {
                        display: d,
                        data: data.tasks
                    };
                    deferred.resolve();
                }, (err) => {
                    console.log(err);
                    deferred.reject(err);
                });
            return deferred.promise;
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
            $('#panel-created-tasks').slideUp("fast");
            getTasksCreated(from, createdTasksPageSize)
                .then(() => {
                    $('#current-page-tasks-created').val(createdTasksPage + 1);
                    $('#panel-created-tasks').slideDown("slow");
                });
        }

        // buttons for pages
        $scope.previousTasksCreated = () => {
            createdTasksPage -= 1;
            if (createdTasksPage < 0) {
                createdTasksPage = 0;
                return;
            }
            $('#panel-created-tasks').slideUp("fast");
            getTasksCreated(createdTasksPage * createdTasksPageSize + 1, createdTasksPageSize)
                .then(() => {
                    $('#current-page-tasks-created').val(createdTasksPage + 1);
                    $('#panel-created-tasks').slideDown("fast");
                });
        }

        $scope.previousTasksToDo = () => {
            tasksToDoPage -= 1;
            if (tasksToDoPage < 0) {
                tasksToDoPage = 0;
                return;
            }
            $('#panel-todo-tasks').slideUp("fast");
            getTasksToDo(tasksToDoPage * tasksToDoPageSize, tasksToDoPageSize)
                .then(() => {
                    $('#current-page-tasks-todo').val(tasksToDoPage + 1);
                    $('#panel-todo-tasks').slideDown("fast");
                });
        }

        $scope.nextTasksToDo = () => {
            tasksToDoPage += 1;
            let from = tasksToDoPage * tasksToDoPageSize + 1;
            if (from > tasksToDoCount) {
                tasksToDoPage -= 1;
                return;
            }
            $('#panel-todo-tasks').slideUp("fast");
            getTasksToDo(from, tasksToDoPageSize)
                .then(() => {
                    $('#current-page-tasks-todo').val(tasksToDoPage + 1);
                    $('#panel-todo-tasks').slideDown("fast");
                });
        }

        // buttons for filtered searches
        $scope.filterToDoTasks = () => {
            let search = $('#inp-filter-tasks-todo').val();
            $('#inp-filter-tasks-todo').val('');
            ajax.get('/search?tasksTodo=' + search, statusHandler)
                .then((data) => {
                    $('#modal-title').html('Filtered Tasks');
                    if (data.length >= 1) {
                        let view = {
                            tasks: data
                        }
                        $.get('../../../templates/mustacheTemplates/filteredTasks.html', (tmpl) => {
                            let rendered = Mustache.render(tmpl, view);
                            $('#modal-content').html(rendered);
                        });
                    } else {
                        $('#modal-content').html('No results for ' + search);
                    }
                });
        }

        $scope.filterCreatedTasks = () => {
            let search = $('#inp-filter-tasks-created').val();
            $('#inp-filter-tasks-created').val('');
            ajax.get('/search?tasksCreated=' + search, statusHandler)
                .then((data) => {
                    $('#modal-title').html('Filtered Tasks');
                    if (data.length >= 1) {
                        let view = {
                            tasks: data
                        }
                        $.get('../../../templates/mustacheTemplates/filteredTasks.html', (tmpl) => {
                            let rendered = Mustache.render(tmpl, view);
                            $('#modal-content').html(rendered);
                        });
                    } else {
                        $('#modal-content').html('No results for ' + search);
                    }
                });
        }
    });