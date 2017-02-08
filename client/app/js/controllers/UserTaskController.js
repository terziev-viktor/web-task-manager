
app.controller('UserTaskController', ['$scope', '$routeParams', '$location', 'notification',
    function ($scope, $routeParams, $location, notification) {
        let taskId = $routeParams.taskId;

        $.ajax({
            method: 'GET',
            url: '/task/' + taskId,
            success: (task) => {
                $scope.task = task;
            }
        });

        $.ajax({
            method: 'GET',
            url: '/task/' + taskId + '/comments',
            success: (data) => {
                console.log('comments');
                console.log(data);
                $scope._comments = data;
            }
        });

        $.ajax({
            method: 'GET',
            url: '/task/' + taskId + '/assignedUsers',
            success: (data) => {
                console.log('assigned users');
                console.log(data);
                $scope.assignedUsers = data;
            }
        });
    }]);