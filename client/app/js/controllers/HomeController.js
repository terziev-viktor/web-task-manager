
app.controller('HomeController', ['$scope', '$location', 'notification',
    function ($scope, $location, notification) {
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
                        $location.path('/user').replace();
                        $scope.$apply();
                    },
                    401: () => {
                        notification.error('Login Failed');
                        $('#login-error-container').html('<span>Login failed</span>');
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
                        $('#signin-error-container').html('<span>' + xhr.responseJSON.err + '</span>');
                    }
                }
            })
        }
    }]
);
