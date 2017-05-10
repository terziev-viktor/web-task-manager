app.controller('TaskCommentsCtrl', function ($scope, $route, $routeParams, $location, FileUploader, notification, statusCodeHandler, authorization, TaskPrioritiesStr, ajax, navbarHandler, animations) {
    let taskId = $routeParams.taskId,
        statusHandler = statusCodeHandler($scope),
        clientDate = new Date(),
        currentUser;
    navbarHandler.handle($location.path());
    animations.showContent();
    authorization.getUser().then((user) => {
        $scope.username = user.Username;
        currentUser = user.Username;
        currentUserFullName = user.FullName
    });

    // post a comment and add a div element with the content to comment list
    $scope.postComment = () => {
        let content = $('#comment-area').val(),
            publishDate = new Date();
        if (content.length == 0) {
            return;
        } else {
            let reqData = {
                content: content,
                date: publishDate.toISOString()
            };

            ajax.post('/task/' + taskId + '/comments', reqData, statusHandler)
                .then((data) => {
                    $route.reload();
                }, (err) => {
                    console.log(err);
                });
        }
    }

    ajax.get('/task/' + taskId + '/comments', statusHandler)
        .then((data) => {
            data.forEach((el) => {
                el.DateFormatted = new Date(el.Date).toLocaleDateString();
            }, this);
            data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
            $scope._comments = data;
        }, (err) => {
            console.log(err);
        });

    ajax.get('/task/' + taskId, statusHandler)
        .then((task) => {
            $('#datetimepicker').datetimepicker({
                inline: true,
                sideBySide: true,
                defaultDate: new Date(task.Deadline)
            });
            task.PriorityStr = TaskPrioritiesStr[task.Priority];
            $scope.task = task;
        }, (err) => {
            console.log(err);
        });
});