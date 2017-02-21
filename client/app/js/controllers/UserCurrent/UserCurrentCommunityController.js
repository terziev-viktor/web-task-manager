app.controller('UserCurrentCommunityController',
    function ($scope, statusCodeHandler, ajax) {
        $('#nav-tab-community').addClass('active');
        $("#nav-tab-tasks").removeClass('active');
        $("#nav-tab-requests").removeClass('active');
        let statusHandler = statusCodeHandler($scope);
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
    });