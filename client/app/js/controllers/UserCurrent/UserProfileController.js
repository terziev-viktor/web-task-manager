app.controller('UserProfileController',
    function ($scope, notification, statusCodeHandler, ajax) {
        let statusHandler = statusCodeHandler($scope);
        $('.to-show').slideDown("slow");
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
            console.log(reqData);
            ajax.post('/user/newpass', reqData, statusHandler).then(() => {
                $('btnsubmit').prop('disabled', false);
            }, () => {
                $('btnsubmit').prop('disabled', false);
            });
        }

    });