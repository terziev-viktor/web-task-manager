app.controller('NewTaskController', ['$scope', '$location',
    function ($scope, $location) {
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
                success: (res) => {
                    //TODO: implement
                },
                error: (err) => {
                    // TODO: implement
                } 

            })
        }
    }]);