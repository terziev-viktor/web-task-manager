app.controller('UserCurrentRequestsCtrl',
    function ($scope, statusCodeHandler, ajax, navbarHandler, $location, animations) {
        let statusHandler = statusCodeHandler($scope);
        navbarHandler.handle($location.path());
        
        // getting user requests
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
                $scope.colleagueReqs = data;    
                animations.showContent();
            });

        // request buttons
        $scope.acceptReqColleague = (username, $event) => {
            $($event.target).prop('disabled', true);
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
            $($event.target).prop('disabled', true);
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
            $($event.target).prop('disabled', true);
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

        $scope.declineReqManager = (username, $event) => {
            $($event.target).prop('disabled', true);
            let reqData = {
                Username: username
            };

            ajax.post('/user/manager?remove=true', reqData, statusHandler)
                .then(() => {
                    console.log($event.target);
                    $($event.target).hide(200);
                }, (err) => {
                    console.log(err);
                    $($event.target).prop('disabled', false);
                });
        }

        $scope.declineReqEmployee = (username, $event) => {
            $($event.target).prop('disabled', true);
            let reqData = {
                Username: username
            };

            ajax.post('/user/employee?remove=true', reqData, statusHandler)
                .then(() => {
                    console.log($event.target);
                    $($event.target).hide(200);
                }, (err) => {
                    console.log(err);
                    $($event.target).prop('disabled', false);
                });
        }

        $scope.declineReqColleague = (username, $event) => {
            $($event.target).prop('disabled', true);
            let reqData = {
                Username: username
            };

            ajax.post('/user/colleagues?remove=true', reqData, statusHandler)
                .then(() => {
                    console.log($event.target);
                    $($event.target).hide(200);
                }, (err) => {
                    console.log(err);
                    $($event.target).prop('disabled', false);
                });

        }

    });