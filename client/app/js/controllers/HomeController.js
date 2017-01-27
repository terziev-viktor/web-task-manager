
app.controller('HomeController', ['$scope', '$location',
    function ($scope, $location) {
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
                        console.log('200');
                        $location.path('/user').replace();
                        $scope.$apply();
                    },
                    401: () => {
                        console.log(401)
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
                        $location.path('/user').replace();
                        $scope.$apply();
                    },
                    500: (xhr) => {
                        console.log(xhr)
                        $('#signin-error-container').html('<span>' + xhr.responseJSON.err + '</span>');
                    }
                }
            })
        }
    }]
);
