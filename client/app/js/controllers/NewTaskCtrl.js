app.controller('NewTaskCtrl', function ($scope, $location, notification, statusCodeHandler, ajax, loadingHtml, navbarHandler, $location, animations) {
    let statusHandler = statusCodeHandler($scope);
    let first = true;
    navbarHandler.handle($location.path());
    animations.showContent();
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
        task.IsArchived = false;

        animations.showLoading();
        $('#div-inp-title').removeClass('has-error');
        $('#div-inp-description').removeClass('has-error');
        $('#div-inp-progress').removeClass('has-error');

        $.ajax({
            method: 'POST',
            url: '/task/',
            data: task,
            statusCode: {
                200: () => {
                    animations.hideLoading();
                    $(".overlay, .overlay-loading-animation").hide();
                    $('#btn-newtask').prop('disabled', false);
                    notification.success('Task created successfully!');
                    $location.path('/tasks');
                    $scope.$apply();
                },
                401: () => {
                    animations.hideLoading();
                    $('#btn-newtask').prop('disabled', false);
                    notification.alert('Login to Web Task Manager, please :-)');
                    $location.path('/');
                    $scope.$apply();
                },
                403: (xhr) => {
                    animations.hideLoading();
                    $(".overlay, .overlay-loading-animation").hide();
                    $('#btn-newtask').prop('disabled', false);
                    notification.error(xhr.responseJSON.msg);
                    switch (xhr.responseJSON.errCode) {
                        case 3:
                            {
                                $('#div-inp-title').addClass('has-error');
                                $('#inp-title').val('');
                                break;
                            }
                        case 4:
                            {
                                $('#div-inp-progress').addClass('has-error');
                                $('#inp-progress').val(0);
                                break;
                            }
                        case 5:
                            {
                                $('#div-inp-description').addClass('has-error');
                                $('#inp-description').val('');
                                break;
                            }
                    }
                },
                500: (xhr) => {
                    animations.hideLoading();
                    $('#btn-newtask').prop('disabled', false);
                    notification.error(xhr.responseJSON.msg);
                }
            }
        });
    }
});