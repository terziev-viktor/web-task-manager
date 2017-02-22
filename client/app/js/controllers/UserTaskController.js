app.controller('UserTaskController', function ($scope, $routeParams, $location, notification, statusCodeHandler, authorization, TaskPrioritiesStr, ajax) {
    let taskId = $routeParams.taskId,
    statusHandler = statusCodeHandler($scope);
    $('.to-show').show(400, 'linear');
    $scope.editTitle = () => {
        let reqUrl = '/task/' + taskId + '?title=' + $('#inp-title').val(),
            reqData = {};
        ajax.post(reqUrl, reqData, statusHandler)
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err);
            });
    }

    $scope.editDescription = () => {
        let reqUrl = '/task/' + taskId + '?desc=' + $('#inp-description').val(),
            reqData = {};
        ajax.post(reqUrl, reqData, statusHandler)
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err);
            });
    }

    $scope.editDeadline = () => {
        let reqUrl = '/task/' + taskId + '?deadline=' + $('#inp-deadline').val(),
            reqData = {};
        ajax.post(reqUrl, reqData, statusHandler)
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err);
            });
    }

    $scope.editProgress = () => {
        let newProgress = $('#inp-progress').val();
        let reqUrl = '/task/' + taskId + '?progress=' + newProgress;
        let reqData = {};

        ajax.post(reqUrl, reqData, statusHandler)
            .then((data) => {
                console.log(data);
                $('#progress-bar').css("width", newProgress + "%").html(newProgress + "% Complete");
            }, (err) => {
                console.log(err);
            });
    }

    $scope.editPriority = () => {
        let newPriority = $('#inp-priority').val();
        let reqUrl = '/task/' + taskId + '?priority=' + newPriority;
        let reqData = {};

        ajax.post(reqUrl, reqData, statusHandler)
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err);
            });
    }

    $scope.postComment = () => {
        let content = $('#comment-area').val();
        if (content.length == 0) {
            return;
        } else {
            let reqData = {
                content: content
            };

            ajax.post('/task/' + taskId + '/comments', reqData, statusHandler)
                .then((data) => {
                    notification.success('Comment posted');
                    $('#comment-area').val('');
                    $('#comment-panel').after('<div class="panel panel-default"><div class="panel-heading">' +
                        '<span>' + authorization.getUser() + '</span>' +
                        '</div>' +
                        ' <div class="panel-body">' +
                        '<p>' + content + '</p>' +
                        '</div></div>');
                }, (err) => {
                    console.log(err);
                });
        }
    }

    $scope.removeUserAssignment = (username, taskid, $event) => {
        let reqData = {
            removeAssignment: username
        };
        ajax.post('/task/' + taskid, reqData, statusHandler)
            .then(() => {
                $($event.currentTarget).hide(200);
            });
    }

    $scope.assignSearch = () => {
        let search = $('#inp-assign-search').val();
        $('#inp-assign-search').val('');
        if (search.length > 0) {
            ajax.get('/search?text=' + search, statusHandler)
                .then((data) => {
                    console.log(data);
                    let ul = jQuery('<ul/>', {
                        class: 'list-group'
                    });
                    if (data && data.length > 0) {
                        data.forEach((element) => {
                            let li = jQuery('<li/>', {
                                class: 'list-group-item text-center'
                            }).append(jQuery('<a/>', {
                                href: '#/user/' + element.Username,
                                text: element.Username
                            })).append(jQuery('<button/>', {
                                class: 'btn btn-default btn-xs',
                                text: 'Assign'
                            }));
                            ul.append(li);
                        });
                    } else {
                        let li = jQuery('<li/>', {
                            class: 'list-group-item',
                            text: 'No search results for "' + search + '"'
                        });
                        ul.append(li);
                    }

                    $('#modal-title').text("Found Users");
                    $('#modal-content').empty().append(ul);
                });
        }
    }

    ajax.get('/user/employees', statusHandler)
        .then((data) => {
            data.forEach((element) => {
                $('#suggestions').append('<option value="' + element.Employee + '">');
            });
        }, (err) => {
            console.log(err);
        });

    ajax.get('/task/' + taskId, statusHandler)
        .then((task) => {
            console.log('get /task/:taskId');
            console.log(task);
            if (authorization.getUser() != task.Creator_Username) {
                $location.path('/user');
                $scope.$apply();
            } else {
                task.DeadlineFormatted = new Date(task.Deadline).toLocaleString();
                task.PriorityStr = TaskPrioritiesStr[task.Priority];
                $scope.task = task;
            }
        }, (err) => {
            console.log(err);
        });

    ajax.get('/task/' + taskId + '/comments', statusHandler)
        .then((data) => {
            $scope._comments = data;
        }, (err) => {
            console.log(err);
        });

    ajax.get('/task/' + taskId + '/assignedUsers', statusHandler)
        .then((data) => {
            $scope.assignedUsers = data;
        }, (err) => {
            console.log(err);
        });
});