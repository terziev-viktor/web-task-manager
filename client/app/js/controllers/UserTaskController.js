
app.controller('UserTaskController', ['$scope', '$routeParams', '$location', 'notification', 'statusCodeHandler', 'authorization',
    function ($scope, $routeParams, $location, notification, statusHandler, authorization) {
        let taskId = $routeParams.taskId, statusCodeHandler = statusHandler($scope);

        $scope.postComment = () => {
            let content = $('#comment-area').val();
            $.ajax({
                method: 'POST',
                url: '/task/' + taskId + '/comments',
                data: {
                    content: content
                },
                statusCode: statusCodeHandler
            });
        }

        $.ajax({
            method: 'GET',
            url: '/task/' + taskId,
            success: (task) => {
                if (authorization.getUser() != task.Creator_Username) {
                    $location.path('/user');
                    $scope.$apply();
                } else {
                    $scope.task = task;
                    $scope.$apply();
                }

            },
            statusCode: statusCodeHandler
        });

        $.ajax({
            method: 'GET',
            url: '/task/' + taskId + '/comments',
            success: (data) => {
                $scope._comments = data;
                $scope.$apply();
            },
            statusCode: statusCodeHandler
        });

        $.ajax({
            method: 'GET',
            url: '/task/' + taskId + '/assignedUsers',
            success: (data) => {
                console.log('assigned users');
                console.log(data);
                $scope.assignedUsers = data;
                $scope.$apply();
            }
        });
    }]);