app.controller('NewTaskController', function ($scope, $location, notification, statusCodeHandler, ajax, loadingHtml, navbarHandler, $location) {
    let statusHandler = statusCodeHandler($scope);
    let first = true;
    navbarHandler.handle($location.path());

    // creating a new task.
    $scope.createTask = () => {
        $('#btn-newtask').prop('disabled', true);
        console.log('Some shit');
        let task = {};
        let deadline = $('#inp-deadline').val().replace('T', ' ');

        task.Title = $('#inp-title').val();
        task.Description = $('#inp-description').val();
        task.Deadline = deadline;
        task.Progress = $('#inp-progress').val();
        task.IsDone = task.Progress == 100 ? 1 : 0;
        task.Priority = $('#inp-priority').val();
        task.Repeatability = $('input[name=optionsRadios]:checked', '#form-new-task').val();
        task.AssigneTo = $('#inp-assignto').val();

        $.ajax({
            method: 'POST',
            url: '/task',
            data: task,
            statusCode: {
                200: () => {
                    $('#btn-newtask').prop('disabled', false);
                    notification.success('Task created successfully!');
                    $location.path('/user');
                    $scope.$apply();
                },
                401: () => {
                    $('#btn-newtask').prop('disabled', false);
                    notification.alert('Login to Web Task Manager, please :-)');
                    $location.path('/');
                    $scope.$apply();
                },
                500: (xhr) => {
                    $('#btn-newtask').prop('disabled', false);
                    notification.error(xhr.responseJSON.err);
                }
            }
        });
    }
});