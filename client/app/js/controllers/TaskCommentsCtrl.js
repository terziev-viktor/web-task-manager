app.controller('TaskCommentsCtrl', function ($q, $scope, $route, $routeParams, $location, notification, statusCodeHandler, authorization, TaskPrioritiesStr, ajax, navbarHandler, animations) {
    let taskId = $routeParams.taskId,
        statusHandler = statusCodeHandler($scope),
        clientDate = new Date(),
        currentUser;
    navbarHandler.handle($location.path());
    animations.showLoading();
    authorization.getUser().then((user) => {
        $scope.username = user.Username;
        currentUser = user.Username;
        currentUserFullName = user.FullName
    });
    $scope.task = {
        TaskId: taskId
    };

    // post a comment and add a div element with the content to comment list
    $scope.postComment = () => {
        let form = new FormData($('#frm')[0]);

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
                    let newcommid = data.id;
                    ajax.upload('/uploads/many/commentdesc?commentId=' + newcommid, form, statusHandler).then((data) => {
                        console.log('after upload on success')
                        console.log(data);
                    }, (err) => {
                        console.log('after upload on error');
                        console.log(err);
                    });
                    $route.reload();
                }, (err) => {
                    console.log(err);
                });
        }
    }

    ajax.get('/task/' + taskId + '/comments', statusHandler)
        .then((data) => {
            let deferred = $q.defer();

            data.forEach((el) => {
                el.DateFormatted = new Date(el.Date).toLocaleDateString();
            }, this);
            data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
            deferred.resolve(data);
            return deferred.promise;
        }, (err) => {
            console.log(err);
        }).then((data1) => {
            let deferred = $q.defer();
            data1.forEach((el) => {
                ajax.get('/uploads/commentdesc?commentId=' + el.CommentId, statusHandler).then((result) => {
                    el.files = result;
                });
            });
            deferred.resolve(data1);
            return deferred.promise;
        }).then((commentsFullObj) => {
            $scope._comments = commentsFullObj;
            animations.hideLoading();
            animations.showContent();
        });
});