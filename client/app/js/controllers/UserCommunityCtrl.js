app.controller('UserCommunityCtrl', function ($scope, $location, $routeParams, statusCodeHandler, ajax, createdTasksPageSize, tasksToDoPageSize, employeesPageSize, managersPageSize, navbarHandler, userData, animations) {
    animations.showLoading(); // loading untill we get enough info to display
    $scope.username = $routeParams.username;
    let statusHandler = statusCodeHandler($scope),
        tasksCreatedPage = 0,
        tasksToDoPage = 0;

    navbarHandler.handle($location.path());
    
    userData.getUserRelational($routeParams.username, statusHandler)
        .then((data) => {
            $scope.user = data;
            animations.hideLoading();
            animations.showContent();
        }, (err) => {
            console.log(err);
        });
    $scope.employees = {
        display: 'loading',
        data: []
    };
    $scope.managers = {
        display: 'loading',
        data: []
    };

    // invite and remove user
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

    $scope.reqEmployee = (username) => {
        let reqData = {
            Username: username
        };
        ajax.post('user/req/employee', reqData, statusHandler);
    }

    $scope.reqManager = (username) => {
        let reqData = {
            Username: username
        };
        ajax.post('user/req/manager', reqData, statusHandler);
    }

    userData.getColleagueTasksTodo($routeParams.username, 1, -1, statusHandler)
        .then((data) => {
            data.tasks.forEach(function (element) {
                element.priorityLow = element.Priority == 0;
                element.priorityMed = element.Priority == 1;
                element.priorityHigh = element.Priority == 2;
                element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
            }, this);
            $scope.tasksTodo = data.tasks;
        }, (err) => {
            console.log(err);
        });

    // TODO: Call with from and size query values. Pagination must be implemented
    userData.getColleagueCreatedTasks($routeParams.username, 1, -1, statusHandler)
        .then((data) => {
            data.tasks.forEach(function (element) {
                element.DeadlineFormatted = new Date(element.Deadline).toLocaleString();
            }, this);
            $scope.tasksCreated = data.tasks;
        }, (err) => {
            console.log(err);
        });

    userData.getColleagueEmployees($routeParams.username, 1, employeesPageSize, statusHandler)
        .then((data) => {
            let view = data.length > 0 ? 'all' : 'none';
            $scope.employees = {
                display: view,
                data: data
            }
        }, (err) => {
            console.log('/user/employees error:');
            console.log(err);
        });

    userData.getColleagueManagers($routeParams.username, 1, managersPageSize, statusHandler)
        .then((data) => {
            let view = data.length > 0 ? 'all' : 'none';
            $scope.managers = {
                display: view,
                data: data
            }
        }, (err) => {
            console.log('/user/managers error:');
            console.log(err);
        });

    $scope.showTaskInfo = (id) => {
        console.log('showtaskinfo');
        console.log(id);

    }
});