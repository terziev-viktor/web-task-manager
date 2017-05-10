app.controller('HomeCtrl',
    function ($scope, notification, statusCodeHandler, ajax, $location, navbarHandler, authorization, animations) {
        let statusHandler = statusCodeHandler($scope);
        navbarHandler.handle($location.path());
        authorization.getUser().then((user) => {
            $scope.fullname = user.FullName;
            $scope.username = user.Username;
            animations.showContent();
        });

        $scope.uploadAvatar = () => {
            let files = {
                avatar: $('#avatar').val()
            };
            let form = new FormData($('#frm')[0]);

            ajax.upload('/uploads/avatar', form, statusHandler).then((err, data) => {
                console.log(err);
                console.log(data);
            });
        }

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