app.controller('UserCurrentRequestsController',
    function ($scope, statusCodeHandler, ajax) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').show(400, 'linear');
        ajax.get('/user/req/manager', statusHandler)
            .then((data) => {
                $scope.managersReq = data;
            });

        ajax.get('/user/req/employee', statusHandler)
            .then((data) => {
                $scope.employeesReq = data;
            });
        ajax.get('/user/req/colleague', statusHandler)
            .then((data) => {
                console.log('/user/req/colleague');
                console.log(data);
                $scope.colleagueReqs = data;
            });

        $scope.acceptReqColleague = (username, $event) => {
            let reqData = {
                Username: username
            };
            ajax.post('/user/colleagues', reqData, statusHandler)
                .then(() => {
                    $($event.currentTarget).hide(200);
                })
        };

        $scope.acceptReqEmployee = (username, $event) => {
            let reqData = {
                Username: username
            };

            ajax.post('/user/employee', reqData, statusHandler)
                .then(() => {
                    $($event.currentTarget).hide(200);
                });
        }

        $scope.acceptReqManager = (username, $event) => {
            let reqData = {
                Username: username
            };

            ajax.post('/user/manager', reqData, statusHandler)
                .then(() => {
                    $($event.currentTarget).hide(200);
                });
        }
    });