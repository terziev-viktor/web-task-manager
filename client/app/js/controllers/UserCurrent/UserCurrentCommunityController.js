app.controller('UserCurrentCommunityController',
    function ($scope, statusCodeHandler, ajax, $q, colleaguesPageSize, managersPageSize, employeesPageSize, userData) {
        let statusHandler = statusCodeHandler($scope),
            colleaguesPage = 0,
            managersPage = 0,
            employeesPage = 0,
            colleaguesCount, managersCount, employeesCount;

        $('.to-show').slideDown("slow");
        let managersAndEmployeesStrings = [];
        $scope.colleagues = {
            display: 'loading',
            data: []
        };
        $scope.employees = {
            display: 'loading',
            data: []
        };
        $scope.managers = {
            display: 'loading',
            data: []
        };

        ajax.get('/user/colleagues?getCount=true', statusHandler)
            .then((data) => {
                $scope.colleaguesCount = data.Count;
                colleaguesCount = data.Count;
            });

        ajax.get('/user/managers?getCount=true', statusHandler)
            .then((data) => {
                $scope.managersCount = data.Count;
                managersCount = data.Count;
            });
            
        ajax.get('/user/employees?getCount=true', statusHandler)
            .then((data) => {
                $scope.employeesCount = data.Count;
                employeesCount = data.Count;
            });

        ajax.get('/user/employees?from=' + employeesPage * employeesPageSize + 1 + '&size=' + employeesPageSize, statusHandler)
            .then((data) => {
                data.forEach((el) => {
                    managersAndEmployeesStrings.push(el.Username);
                });
                let d = data.length > 0 ? 'all' : 'none';
                $scope.employees = {
                    display: d,
                    data: data
                };
                return ajax.get('/user/managers', statusHandler);
            })
            .then((data) => {
                data.forEach((el) => {
                    managersAndEmployeesStrings.push(el.Username);
                });
                let d = data.length > 0 ? 'all' : 'none';
                $scope.managers = {
                    display: d,
                    data: data
                };
                return ajax.get('/user/colleagues?from=' + (colleaguesPage * colleaguesPageSize + 1) + '&size=' + colleaguesPageSize, statusHandler);
            })
            .then((data) => {
                $scope.managersAndEmployeesStrings = managersAndEmployeesStrings;
                let d = data.length > 0 ? 'all' : 'none';
                $scope.colleagues = {
                    display: d,
                    data: data
                };
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

        $scope.previousColleaguesPage = () => {
            colleaguesPage -= 1;
            if (colleaguesPage < 0) {
                colleaguesPage = 0;
                return;
            }
            $('#panel-community').slideUp("fast");
            userData.getColleagues(colleaguesPage * colleaguesPageSize + 1, colleaguesPageSize, statusHandler).then((data) => {
                let d = data.length > 0 ? 'all' : 'none';
                $scope.colleagues = {
                    display: d,
                    data: data
                };
                $('#panel-community').slideDown("fast");
                $('#colleague-page').val(colleaguesPage + 1);
            });
        }

        $scope.nextColleaguesPage = () => {
            colleaguesPage += 1;
            let from = colleaguesPage * colleaguesPageSize + 1;
            if (from > colleaguesCount) {
                colleaguesPage -= 1;
                return;
            }
            $('#panel-community-colleagues').slideUp("fast");
            userData.getColleagues(from, colleaguesPageSize, statusHandler).then((data) => {
                let d = data.length > 0 ? 'all' : 'none';
                $scope.colleagues = {
                    display: d,
                    data: data
                };
                $('#panel-community-colleagues').slideDown("fast");
                $('#colleague-page').val(colleaguesPage + 1);
            });
        }

        $scope.previousManagersPage = () => {

        }

        $scope.nextManagersPage = () => {
            managersPage += 1;
            let from = managersPage * managersPageSize + 1;
            if (from > managersCount) {
                managersPage -= 1;
            }
            $('#panel-community-managers').slideUp("fast");
            userData.getManagers(from, managersPageSize, statusHandler)
                .then((data) => {
                    let d = data.length > 0 ? 'all' : 'none';
                    $scope.managers = {
                        display: d,
                        data: data
                    };
                    $('#panel-community-managers').slideDown("fast");
                    $('#colleague-page').val(colleaguesPage + 1);
                });
        }

        $scope.previousEmployeesPage = () => {

        }

        $scope.nextEmployeesPage = () => {

        }
    });