app.controller('TaskController', function ($scope, $routeParams, TaskPrioritiesStr, statusCodeHandler, ajax, notification, authorization) {
    let taskId = $routeParams.taskId,
        statusHandler = statusCodeHandler($scope);
    ajax.get('/task/' + taskId, statusHandler)
        .then((task) => {
            task.DeadlineFormatted = new Date(task.Deadline).toLocaleString();
            task.PriorityStr = TaskPrioritiesStr[task.Priority];
            $scope.task = task;

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
});