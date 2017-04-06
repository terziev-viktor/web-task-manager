app.controller('UserCurrentRequestsCtrl',
    function ($scope, statusCodeHandler, ajax, navbarHandler, $location) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').fadeIn(350);
        navbarHandler.handle($location.path());
        ajax.get('/user/req/manager', statusHandler)
            .then((data) => {
                $scope.managersReq = data;
            });

        // getting user requests
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

        // request buttons
        $scope.acceptReqColleague = (username, $event) => {
            $($event.target).prop('disables', true);
            let reqData = {
                Username: username
            };
            ajax.post('/user/colleagues', reqData, statusHandler)
                .then(() => {
                    $($event.target).hide(200);
                }, (err) => {
                    console.log(err);
                    $($event.target).prop('disabled', false);
                });
        };

        $scope.acceptReqEmployee = (username, $event) => {
            $($event.target).prop('disables', true);
            let reqData = {
                Username: username
            };

            ajax.post('/user/employee', reqData, statusHandler)
                .then(() => {
                    console.log($event.target);
                    $($event.target).hide(200);
                }, (err) => {
                    console.log(err);
                    $($event.target).prop('disabled', false);
                });
        }

        $scope.acceptReqManager = (username, $event) => {
            $($event.target).prop('disables', true);
            let reqData = {
                Username: username
            };

            ajax.post('/user/manager', reqData, statusHandler)
                .then(() => {
                    console.log($event.target);
                    $($event.target).hide(200);
                }, (err) => {
                    console.log(err);
                    $($event.target).prop('disabled', false);
                });
        }
    });