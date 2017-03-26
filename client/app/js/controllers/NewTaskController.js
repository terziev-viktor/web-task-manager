app.controller('NewTaskController', function ($scope, $location, notification, statusCodeHandler, ajax, loadingHtml, navbarHandler, $location) {
    let statusHandler = statusCodeHandler($scope);
    let first = true;
    navbarHandler.handle($location.path());

    $('#datetimepicker12').datetimepicker({
        inline: true,
        sideBySide: true
    });
    // creating a new task.
    $scope.createTask = () => {
        $('#btn-newtask').prop('disabled', true);
        let datetimePicker_d = $('#datetimepicker12').datetimepicker('date')._d; // get datetime inline picker data
        let deadlineISO = new Date(datetimePicker_d).toISOString(); // convert to ISO string

        let task = {};
        task.Title = $('#inp-title').val();
        task.Description = $('#inp-description').val();
        task.Deadline = deadlineISO;
        task.Progress = $('#inp-progress').val();
        task.IsDone = task.Progress == 100 ? 1 : 0;
        task.Priority = $('#inp-priority').val();
        task.Repeatability = $('input[name=optionsRadios]:checked', '#form-new-task').val();

        if (task.Progress > 100 || task.Progress < 0) {
            notification.warning('Task progress must be in range 0 to 100');
            return;
        }
        $(".overlay, .overlay-loading-animation").show();

        $.ajax({
            method: 'POST',
            url: '/task/',
            data: task,
            statusCode: {
                200: () => {
                    $(".overlay, .overlay-loading-animation").hide();
                    $('#btn-newtask').prop('disabled', false);
                    notification.success('Task created successfully!');
                    $location.path('/user/current/tasks');
                    $scope.$apply();
                },
                401: () => {
                    $(".overlay, .overlay-loading-animation").hide();

                    $('#btn-newtask').prop('disabled', false);
                    notification.alert('Login to Web Task Manager, please :-)');
                    $location.path('/');
                    $scope.$apply();
                },
                500: (xhr) => {
                    $(".overlay, .overlay-loading-animation").hide();
                    $('#btn-newtask').prop('disabled', false);
                    notification.error(xhr.responseJSON.err);
                }
            }
        });
    }
});