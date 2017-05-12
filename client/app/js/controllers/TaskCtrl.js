app.controller('TaskCtrl', function ($scope, $routeParams, $location, FileUploader, notification, statusCodeHandler, authorization, TaskPrioritiesStr, ajax, navbarHandler, animations) {
    animations.showContent();
    let taskId = $routeParams.taskId,
        statusHandler = statusCodeHandler($scope),
        clientDate = new Date(),
        currentUser;
    navbarHandler.handle($location.path());

    authorization.getUser().then((user) => {
        $scope.username = user.Username;
        currentUser = user.Username;
        currentUserFullName = user.FullName
    });

    ajax.get('/uploads/taskdesc?taskId=' + taskId, statusHandler).then((data) => {
        let imagesOnly = [];
        let filesNotImages = [];
        data.forEach((e) => {
            if (e.Mimetype.includes("image")) {
                imagesOnly.push(e);
            } else {
                filesNotImages.push(e);
            }
        }, this);
        $scope.taskfilesImages = imagesOnly;
        $scope.taskfilesOther = filesNotImages;
        // show content to the client

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
            $('#inpattachment').fileinput({
                uploadUrl: '/uploads/many/descfiles?taskId=' + taskId
            });
        }, (err) => {
            console.log(err);
        });

    $scope.deleteFile = (file) => {
        console.log(file);
        ajax.post('/uploads/delete', file, statusHandler).then(() => {
            $("#thumbid" + file.Id).remove();
        }, (err) => {
            console.log(err);
        })
    }
    // edit buttons
    $scope.editTitle = () => {
        let reqUrl = '/task/' + taskId,
            reqData = {
                title: $('#inp-title').val()
            };
        ajax.post(reqUrl, reqData, statusHandler);
    }

    $scope.editDescription = () => {
        let reqUrl = '/task/' + taskId,
            reqData = {
                desc: $('#inp-description').val()
            };
        ajax.post(reqUrl, reqData, statusHandler);
    }

    $scope.editDeadline = () => {
        let datetimePicker_d = $('#datetimepicker').datetimepicker('date')._d; // get datetime inline picker data
        let deadlineISO = new Date(datetimePicker_d).toISOString(); // convert to ISO string
        let reqUrl = '/task/' + taskId,
            reqData = {
                deadline: deadlineISO
            };
        ajax.post(reqUrl, reqData, statusHandler);
    }

    $scope.editProgress = () => {
        let newProgress = $('#inp-progress').val();
        let reqUrl = '/task/' + taskId;
        let reqData = {
            progress: newProgress
        };

        ajax.post(reqUrl, reqData, statusHandler)
            .then((data) => {
                $('#progress-bar').css("width", newProgress + "%").html(newProgress + "% Complete");
            }, (err) => {
                console.log(err);
            });
    }

    $scope.editPriority = () => {
        let newPriority = $('#inp-priority').val();
        let reqUrl = '/task/' + taskId;
        let reqData = {
            priority: newPriority
        };

        ajax.post(reqUrl, reqData, statusHandler);
    }

});