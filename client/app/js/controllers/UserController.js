

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
                console.log(tasksTodo);
               
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
                console.log(tasksCreated);
                $scope.tasksCreated = tasksCreated;
                $scope.$apply();
            }
        });
}]);
