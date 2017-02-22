app.controller('UserCurrentCommunityController',
    function ($scope, statusCodeHandler, ajax) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').show(400, 'linear');
        let managersAndEmployeesStrings = [];
        ajax.get('/user/employees', statusHandler)
            .then((data) => {
                data.forEach((el) => {
                    managersAndEmployeesStrings.push(el.Employee);
                });
                $scope.employees = data;
                return ajax.get('/user/managers', statusHandler);
            })
            .then((data) => {
                data.forEach((el) => {
                    managersAndEmployeesStrings.push(el.Manager);
                });
                $scope.managers = data;
                return ajax.get('/user/colleagues', statusHandler);
            })
            .then((data) => {
                $scope.managersAndEmployeesStrings = managersAndEmployeesStrings;
                $scope.colleagues = data;
            });
        $scope.reqManager = (username) => {
            console.log(username);
            let reqData = {
                Username: username
            };
            ajax.post('user/req/manager', reqData, statusHandler)
                .then(() => {
                    console.log('post -> user/req/manager success');
                });
        }

        $scope.reqEmployee = (username) => {
            console.log(username);
            let reqData = {
                Username: username
            };
            ajax.post('user/req/employee', reqData, statusHandler)
                .then(() => {
                    console.log('request sent');
                });
        }

        $scope.removeManager = (username, $event) => {
            ajax.post('/user/manager?remove=' + username, {
                    Username: username
                }, statusHandler)
                .then((data) => {
                    $($event.currentTarget).hide(200);
                });
        }

        $scope.removeEmployee = (username, $event) => {
            let reqdata = {
                Username: username
            };
            ajax.post('/user/employee?remove=' + username, reqdata, statusHandler)
                .then(() => {
                    $($event.currentTarget).hide(200);
                });
        }
        
    });