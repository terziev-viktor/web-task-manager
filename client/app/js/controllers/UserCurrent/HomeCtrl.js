app.controller('HomeCtrl',
    function ($scope, notification, statusCodeHandler, ajax, $location, navbarHandler) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').slideDown("slow");
        navbarHandler.handle($location.path());
        $scope.fullname = sessionStorage['fullname'];
        $scope.username = sessionStorage['currentUser'];
        

        $scope.updatePassword = () => {
            $('btnsubmit').prop('disabled', true);
            let oldpass = $('#oldpass').val(),
                newpass = $('#newpass').val(),
                confirmpass = $('#confirmpass').val();
            $('#oldpass').val('');
            $('#newpass').val('');
            $('#confirmpass').val('');
            let reqData = {
                oldpass: oldpass,
                newpass: newpass,
                confirm: confirmpass
            }
            ajax.post('/user/newpass', reqData, statusHandler).then(() => {
                $('btnsubmit').prop('disabled', false);
            }, () => {
                $('btnsubmit').prop('disabled', false);
            });
        }

    });