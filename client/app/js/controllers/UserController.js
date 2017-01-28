

app.controller('UserController', ['$scope', '$location',
    function ($scope, $location) {
        let tasksTodo, tasksCreated;

        $.ajax({
            method: 'GET',
            url: '/tasks/todo',
            success: (data) => {
                tasksTodo = data.tasks;
            },
            error: (err) => {
                console.log('error');
                console.log(err);
            },
            complete: () => {
                tasksTodo.forEach(function(element) {
                    element.priorityLow = element.Priority == 0;
                    element.priorityMed = element.Priority == 1;
                    element.priorityHigh = element.Priority == 2;
                }, this);
                 $scope.tasksTodo = tasksTodo;
                $scope.$apply();
            }
        });

        $.ajax({
            method: 'GET',
            url: '/tasks/created',
            success: (data, stringStatus, xhr) => {
                tasksCreated = data.tasks;
            },
            error: (err) => {
                console.log('error');
                console.log(err);
            },
            complete: (xhr, textStatus) => {
                $scope.tasksCreated = tasksCreated;
                $scope.$apply();
            }
        });

        $scope.showTaskInfo = (id) => {
            console.log('showtaskinfo');
            console.log(id);
            // $.ajax({
            //     method:'GET',
            //     url: '/task/comments',
            //     headers: {
            //         'taskId': id
            //     },
            //     success: (data) => {
            //         console.log('data in success');
            //         console.log(data);
            //         console.log(id);
            //         let divId = '#comments' + id;
            //         let comments = '';
            //         data.forEach((element) => {
            //             comments += '<div><p>' + element.Author + ' on ' + element.Date + '</p><br>';
            //             comments += '<p>' + element.Content + '</p><br></div>';
            //         });
            //         $(divId).append(comments);
            //     }
            // });
        }
}]);
