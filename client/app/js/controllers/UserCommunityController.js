app.controller('UserCommunityController', function ($scope, $location, $routeParams, notification, statusCodeHandler, authorization, ajax) {
    $scope.username = $routeParams.username;
    let statusHandler = statusCodeHandler($scope);
    $('.to-show').slideDown("slow");
    
    $scope.inviteColleague = (username) => {
        let reqData = {
            Username: username
        };
        ajax.post('/user/req/colleague', reqData, statusHandler);
    }

    $scope.removeColleague = (username) => {
        let reqData = {
            Username: username
        };
        ajax.post('/user/colleagues?remove=true', reqData, statusHandler);
    }

    ajax.get('/tasks/todo/' + $routeParams.username, statusHandler)
        .then((data) => {
            data.tasks.forEach(function (element) {
                element.priorityLow = element.Priority == 0;
                element.priorityMed = element.Priority == 1;
                element.priorityHigh = element.Priority == 2;
                element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
            }, this);
            $scope.tasksTodo = data.tasks;
        }, (err) => {
            console.log('/tasks/todo error:');
            console.log(err);
        });
        // TODO: Call with from and size query values
    ajax.get('/tasks/created/' + $routeParams.username, statusHandler)
        .then((data) => {
            data.tasks.forEach(function (element) {
                element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
            }, this);
            $scope.tasksCreated = data.tasks;
        }, (err) => {
            console.log('/tasks/created error:');
            console.log(err);
        });

    ajax.get('/user/employees/' + $routeParams.username, statusHandler)
        .then((data) => {
            $scope.employees = data;
        }, (err) => {
            console.log('/user/employees error:');
            console.log(err);
        });

    ajax.get('/user/managers/' + $routeParams.username, statusHandler)
        .then((data) => {
            $scope.managers = data;
        }, (err) => {
            console.log('/user/managers error:');
            console.log(err);
        });


    $scope.showTaskInfo = (id) => {
        console.log('showtaskinfo');
        console.log(id);

    }

});