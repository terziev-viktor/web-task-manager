app.controller('TaskCtrl', function ($scope, $routeParams, $location, notification, statusCodeHandler, authorization, TaskPrioritiesStr, ajax, navbarHandler) {
    let taskId = $routeParams.taskId,
        statusHandler = statusCodeHandler($scope),
        clientDate = new Date(),
        currentUser;
    navbarHandler.handle($location.path());
    $('.to-show').fadeIn(350);
    authorization.getUser().then((user) => {
        $scope.username = user.Username;
        currentUser = user.Username;
    });

    // edit buttons
    $scope.editTitle = () => {
        let reqUrl = '/task/' + taskId + '?title=' + $('#inp-title').val(),
            reqData = {};
        ajax.post(reqUrl, reqData, statusHandler);
    }

    $scope.editDescription = () => {
        let reqUrl = '/task/' + taskId + '?desc=' + $('#inp-description').val(),
            reqData = {};
        ajax.post(reqUrl, reqData, statusHandler);
    }

    $scope.editDeadline = () => {
        let datetimePicker_d = $('#datetimepicker').datetimepicker('date')._d; // get datetime inline picker data
        let deadlineISO = new Date(datetimePicker_d).toISOString(); // convert to ISO string
        let reqUrl = '/task/' + taskId + '?deadline=' + deadlineISO,
            reqData = {};
        ajax.post(reqUrl, reqData, statusHandler);
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

        ajax.post(reqUrl, reqData, statusHandler);
    }


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
                    notification.success('Comment posted');
                    let appendComment = (tmpl) => {
                        let rendered = Mustache.render(tmpl, {
                            User: currentUser,
                            Content: content,
                            PublishDate: publishDate.toLocaleDateString()
                        });
                        $('#comment-area').val('');
                        $('#comment-publication-panel').after(rendered);
                    };
                    if (!$routeParams.commentTempl) {
                        ajax.get('../../templates/commentTemplate.html')
                            .then((tmpl) => {
                                $routeParams.commentTempl = tmpl;
                                appendComment($routeParams.commentTempl)
                            });
                    } else {
                        appendComment($routeParams.commentTempl)
                    }
                }, (err) => {
                    console.log(err);
                });
        }
    }


    // assign and decline buttons
    $scope.removeUserAssignment = (username, taskid, $event) => {
        let reqData = {
            removeAssignment: username
        };
        ajax.post('/task/' + taskid, reqData, statusHandler)
            .then(() => {
                $($event.srcElement).parent().parent().hide('fast');
            });
    }

    $scope.assignSearch = () => {
        $.get('/app/templates/assignSearchContentPanel.html', (tmpl) => {
            let rendered = Mustache.render(tmpl, {
                taskId: taskId
            })
            $('#modal-content').html(rendered);
        });
    }

    ajax.get('/user/employees?from=1&size=-1', statusHandler)
        .then((data) => {
            data.forEach((element) => {
                $('#suggestions').append('<option value="' + element.Employee + '">');
            });
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

    ajax.get('/task/' + taskId + '/comments', statusHandler)
        .then((data) => {
            data.forEach((el) => {
                el.DateFormatted = new Date(el.Date).toLocaleDateString();
            }, this);
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