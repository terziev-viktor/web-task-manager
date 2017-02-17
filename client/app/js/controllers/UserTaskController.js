app.controller('UserTaskController', function ($scope, $routeParams, $location, notification, statusCodeHandler, authorization, TaskPrioritiesStr) {
    let taskId = $routeParams.taskId,
        statusHandler = statusCodeHandler($scope);

    $scope.editTitle = () => {
        $.ajax({
            method: 'POST',
            url: '/task/' + taskId + '?title=' + $('#inp-title').val(),
            success: (data) => {
                console.log(data);
            },
            statusCode: statusHandler
        });
    }

    $scope.editDescription = () => {
        $.ajax({
            method: 'POST',
            url: '/task/' + taskId + '?desc=' + $('#inp-description').val(),
            success: (data) => {
                console.log(data);
            },
            statusCode: statusHandler
        });
    }

    $scope.editDeadline = () => {
        $.ajax({
            method: 'POST',
            url: '/task/' + taskId + '?deadline=' + $('#inp-deadline').val(),
            success: (data) => {
                console.log(data);
            },
            statusCode: statusHandler
        });
    }

    $scope.editProgress = () => {
        let newProgress = $('#inp-progress').val();
        $.ajax({
            method: 'POST',
            url: '/task/' + taskId + '?progress=' + newProgress,
            success: (data) => {
                console.log(data);
                $('#progress-bar').css('width', newProgress + '%').html(newProgress + " % Complete");

            },
            statusCode: statusHandler
        });
    }

    $scope.editPriority = () => {
        let newPriority = $('#inp-priority').val();
        $.ajax({
            method: 'POST',
            url: '/task/' + taskId + '?priority=' + newPriority,
            success: (data) => {
                console.log(data);
                $('#lbl-priority').html('Task Priority: ' + TaskPrioritiesStr[newPriority]);
            },
            statusCode: statusHandler
        });
    }

    $scope.postComment = () => {
        let content = $('#comment-area').val();
        if (content.length == 0) {
            return;
        } else {
            $.ajax({
                method: 'POST',
                url: '/task/' + taskId + '/comments',
                data: {
                    content: content
                },
                success: () => {
                    notification.success('Comment posted');
                    $('#comment-area').val('');
                    $('#comment-panel').after('<div class="panel panel-default"><div class="panel-heading">' +
                        '<span>' + authorization.getUser() + '</span>' +
                        '</div>' +
                        ' <div class="panel-body">' +
                        '<p>' + content + '</p>' +
                        '</div></div>');
                }
            });
        }
    }

    $scope.removeUserAssignment = (username, taskid, $event) => {
        $.ajax({
            method: 'POST',
            url: '/task/' + taskid,
            data: {
                removeAssignment: username
            },
            success: () => {
                $($event.currentTarget).hide(200);
            },
            statusCode: statusHandler
        });
    }

    $.ajax({
        method: 'GET',
        url: '/user/employees',
        success: (data) => {
            data.forEach((element) => {
                $('#suggestions').append('<option value="' + element.Employee + '">');
            });
        }
    });

    $.ajax({
        method: 'GET',
        url: '/task/' + taskId,
        success: (task) => {
            if (authorization.getUser() != task.Creator_Username) {
                $location.path('/user');
                $scope.$apply();
            } else {
                task.DeadlineFormatted = new Date(task.Deadline).toLocaleString();
                task.PriorityStr = TaskPrioritiesStr[task.Priority];
                $scope.task = task;
                $scope.$apply();
            }

        },
        statusCode: statusHandler
    });

    $.ajax({
        method: 'GET',
        url: '/task/' + taskId + '/comments',
        success: (data) => {
            $scope._comments = data;
            $scope.$apply();
        },
        statusCode: statusHandler
    });

    $.ajax({
        method: 'GET',
        url: '/task/' + taskId + '/assignedUsers',
        success: (data) => {
            console.log('assigned users');
            console.log(data);
            $scope.assignedUsers = data;
            $scope.$apply();
        },
        statusCode: statusHandler
    });
});