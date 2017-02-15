app.controller('NewTaskController', ['$scope', '$location', 'notification',
    function ($scope, $location, notification, statusCodeHandler) {
        let statusHandler = statusCodeHandler($scope);
        let first = true;
        $.ajax({
            method: 'GET',
            url: '/user/employees',
            success: (data) => {
                data.forEach((element) => {
                    $('#suggestions').append('<option value="' + element.Employee + '">');
                });
            }
        });

        $scope.addToAssign = () => {
            let userToAssign = $('#inp-search').val();
            if(first) {
                $('#inp-assignto').append(userToAssign);
                first = false;
            } else {
                $('#inp-assignto').append(', ' + userToAssign);
            }
        }

        $scope.createTask = () => {
            let task = {};
            let deadline = $('#inp-deadline').val().replace('T', ' ');

            task.Title = $('#inp-title').val();
            task.Description = $('#inp-description').val();
            task.Deadline = deadline;
            task.Progress = $('#inp-progress').val();
            task.IsDone = task.Progress == 100 ? 1: 0;
            task.Priority = $('#inp-priority').val();
            task.Repeatability = $('input[name=optionsRadios]:checked', '#form-new-task').val();
            task.AssigneTo = $('#inp-assignto').val();
            
            $.ajax({
                method: 'POST',
                url: '/task',
                data: task,
                statusCode: {
                    200: () => {
                        notification.success('Task created successfully!');
                        $location.path('/user');
                        $scope.$apply();
                    },
                    401: () => {
                        notification.alert('Login to Web Task Manager, please :-)');
                        $location.path('/');
                        $scope.$apply();
                    },
                    500: (xhr) => {
                        notification.error(xhr.responseJSON.err);
                    }
                }
            });
        }
    }]);