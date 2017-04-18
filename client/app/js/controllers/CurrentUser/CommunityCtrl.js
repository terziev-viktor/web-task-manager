app.controller('CommunityCtrl',
    function ($scope, statusCodeHandler, ajax, $q, colleaguesPageSize, managersPageSize, employeesPageSize, userData, navbarHandler, $location, animations) {
        let statusHandler = statusCodeHandler($scope),
            colleaguesPage = 0,
            managersPage = 0,
            employeesPage = 0,
            colleaguesCount, managersCount, employeesCount;
        navbarHandler.handle($location.path());
        // setting default views for panels
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


        // getting count of managers, colleagues and employees
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
                animations.showContent();
            });

        userData.getColleagues(colleaguesPage * colleaguesPageSize + 1, colleaguesPageSize, statusHandler).then((data) => {
            console.log(data);
            let d = data.length > 0 ? 'all' : 'none';
            $scope.colleagues = {
                display: d,
                data: data
            };
        });

        userData.getEmployees(1, colleaguesPageSize, statusHandler).then((data) => {
            let d = data.length > 0 ? 'all' : 'none';
            $scope.employees = {
                display: d,
                data: data
            };
        });

        userData.getManagers(1, managersPageSize, statusHandler).then((data) => {
            let d = data.length > 0 ? 'all' : 'none';
            $scope.managers = {
                display: d,
                data: data
            };
        });
        // display filtered colleagues on the modal
        $scope.filterColleagues = () => {
            let filter = $('#inp-filter-colleagues').val();
            $('#inp-filter-colleagues').val('');
            ajax.get('/search?colleagues=' + filter, statusHandler)
                .then((data) => {
                    let view = {
                        colleagues: data
                    }
                    $.get('../../../templates/mustacheTemplates/filteredColleagues.html', (tmpl) => {
                        let rendered = Mustache.render(tmpl, view);
                        $('#modal-content').html(rendered);
                        $('#modal-title').html('Filtered Colleagues');
                    });
                }, (err) => {
                    console.log('error get /search?colleagues=' + filter);
                    console.log(err);
                });
        }

        $scope.filterManagers = () => {
            let filter = $('#inp-filter-managers').val();
            $('#inp-filter-managers').val('');
            ajax.get('/search?managers=' + filter, statusHandler)
                .then((data) => {
                    let view = {
                        managers: data
                    }
                    $.get('../../../templates/mustacheTemplates/filteredManagers.html', (tmpl) => {
                        let rendered = Mustache.render(tmpl, view);
                        $('#modal-content').html(rendered);
                        $('#modal-title').html('Filtered Colleagues');
                    });
                })
        }

        // buttons for requests
        $scope.reqManager = (username) => {
            console.log(username);
            let reqData = {
                Username: username
            };
            ajax.post('user/req/manager', reqData, statusHandler);
        }

        $scope.reqEmployee = (username) => {
            console.log(username);
            let reqData = {
                Username: username
            };
            ajax.post('user/req/employee', reqData, statusHandler);
        }

        $scope.removeEmployeeRequest = (username) => {
            let reqBody = {
                remove: username
            }
            ajax.post('/user/req/employee', reqBody, statusHandler);
        }

        $scope.removeManagerRequest = (username) => {
            let reqBody = {
                remove: username
            }
            ajax.post('/user/req/manager', reqBody, statusHandler);
        }

        $scope.removeManager = (username, $event) => {
            ajax.post('/user/manager?remove=true', {
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
            ajax.post('/user/employee?remove=true', reqdata, statusHandler)
                .then(() => {
                    $($event.currentTarget).hide(200);
                });
        }

        $scope.removeColleague = (username, $event) => {
            let reqData = {
                Username: username
            };
            ajax.post('/user/colleagues?remove=true', reqData, statusHandler)
                .then(() => {
                    $($event.currentTarget).hide(200);
                });
        }

        // buttons for pages
        $scope.previousColleaguesPage = () => {
            colleaguesPage -= 1;
            if (colleaguesPage < 0) {
                colleaguesPage = 0;
                return;
            }
            $('#panel-community-colleagues').slideUp("fast");
            userData.getColleagues(colleaguesPage * colleaguesPageSize + 1, colleaguesPageSize, statusHandler).then((data) => {
                let d = data.length > 0 ? 'all' : 'none';
                $scope.colleagues = {
                    display: d,
                    data: data
                };
                $('#panel-community-colleagues').slideDown("fast");
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
            managersPage -= 1;
            if (managersPage < 0) {
                managersPage = 0;
                return;
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
                    $('#managers-page').val(colleaguesPage + 1);
                });
        }

        $scope.nextManagersPage = () => {
            managersPage += 1;
            let from = managersPage * managersPageSize + 1;
            if (from > managersCount) {
                managersPage -= 1;
                return;
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
                    $('#managers-page').val(colleaguesPage + 1);
                });
        }

        $scope.previousEmployeesPage = () => {
            employeesPage -= 1;
            if (employeesPage < 0) {
                employeesPage = 0;
                return;
            }
            $('#panel-community-managers').slideUp("fast");
            userData.getEmployees(from, employeesPageSize, statusHandler)
                .then((data) => {
                    let d = data.length > 0 ? 'all' : 'none';
                    $scope.employees = {
                        display: d,
                        data: data
                    };
                    $('#panel-community-managers').slideDown("fast");
                    $('#managers-page').val(employeesPage + 1);
                });
        }

        $scope.nextEmployeesPage = () => {
            employeesPage += 1;
            let from = employeesPage * employeesPageSize + 1;
            if (from > employeesCount) {
                employeesPage -= 1;
                return;
            }
            $('#panel-community-managers').slideUp("fast");
            userData.getEmployees(from, employeesPage, statusHandler)
                .then((data) => {
                    let d = data.length > 0 ? 'all' : 'none';
                    $scope.employees = {
                        display: d,
                        data: data
                    };
                    $('#panel-community-managers').slideDown("fast");
                    $('#managers-page').val(employeesPage + 1);
                });
        }
    });