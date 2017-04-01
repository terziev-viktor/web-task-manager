app.controller('UserCurrentRequestsCtrl',
    function ($scope, statusCodeHandler, ajax, navbarHandler, $location) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').slideDown("slow");
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