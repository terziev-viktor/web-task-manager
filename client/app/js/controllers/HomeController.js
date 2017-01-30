
app.controller('HomeController', ['$scope', '$location', 'notification',
    function ($scope, $location, notification) {
        $('#li-profile').hide();
        $('#li-logout').hide();

        $scope.showDocs = () => {
            $('#docs').css('display: inline');
        }

        $.ajax({
            method: 'GET',
            url: '/user',
            success: () => {
                $('#li-profile').show(300);
                $('#li-logout').show(300);
            }
        });

        $scope.login = function () {
            let data = {
                username: $('#inp-login-username').val(),
                password: $('#inp-login-password').val()
            }

            $.ajax({
                method: 'POST',
                url: '/login',
                data: data,
                statusCode: {
                    200: () => {
                        notification.success('Login successful!');
                        $('#home-forms-container').hide(350);
                        setTimeout(function () {
                            $location.path('/user').replace();
                            $scope.$apply();
                        }, 350);
                    },
                    401: () => {
                        notification.error('Login Failed');
                    },
                    400: () => {
                        notification.info('Enter your username and password first!');
                    }
                }
            })
        }

        $scope.signin = function () {
            let data = {
                username: $('#inp-signin-username').val(),
                password: $('#inp-signin-password').val(),
                confirm: $('#inp-signin-confirm').val()
            }
            // console.log(data);

            $.ajax({
                method: 'POST',
                url: '/signin',
                data: data,
                statusCode: {
                    200: (xhr) => {
                        notification.success('Signin successful');
                        $location.path('/user').replace();
                        $scope.$apply();
                    },
                    500: (xhr) => {
                        notification.error(xhr.responseJSON.err);
                    }
                }
            })
        }
    }]
);
