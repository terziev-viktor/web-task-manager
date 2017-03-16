app.controller('UserProfileController',
    function ($scope, notification, statusCodeHandler, ajax, navbarHandler) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').slideDown("slow");
        $scope.fullname = sessionStorage['fullname'];
        $scope.username = sessionStorage['currentUser'];
        navbarHandler.handle();

        $scope.updatePassword = () => {
            let oldpass = $('#oldpass').val(),
                newpass = $('#newpass').val(),
                confirmpass = $('#confirmpass').val();
            let reqData = {
                oldpass: oldpass,
                newpass: newpass,
                confirm: confirmpass
            }
            console.log(reqData);
            ajax.post('/user/newpass', reqData, statusHandler);
        }

    });