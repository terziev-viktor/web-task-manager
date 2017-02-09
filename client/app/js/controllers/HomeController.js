
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
                    200: (xhr) => {
                        notification.success('Login successful!');
                        sessionStorage['currentUser'] = xhr.user;
                        $('#home-forms-container').hide(350);
                        setTimeout(function () {
                            $location.path('/user').replace();
                            $scope.$apply();
                        }, 350);
                    },
                    401: () => {
                        notification.error('Login Failed');
                        $('#inp-login-username').val('');
                        $('#inp-login-password').val('');
                    },
                    400: () => {
                        notification.info('Enter your username and password first!');
                        $('#inp-login-username').val('');
                        $('#inp-login-password').val('');
                    }
                }
            });
        }

        $scope.signin = function () {
            let data = {
                username: $('#inp-signin-username').val(),
                password: $('#inp-signin-password').val(),
                confirm: $('#inp-signin-confirm').val()
            }

            $.ajax({
                method: 'POST',
                url: '/signin',
                data: data,
                statusCode: {
                    200: (xhr) => {
                        notification.success('Signup successful.');
                        sessionStorage['currentUser'] = xhr.responseJSON.user;                        
                        $location.path('/user').replace();
                        $scope.$apply();
                    },
                    500: (xhr) => {
                        notification.error(xhr.responseJSON.err);
                        $('#inp-signin-password').val('');
                        $('#inp-signin-confirm').val('');
                    }
                }
            })
        }
    }]
);
