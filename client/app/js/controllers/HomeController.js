app.controller('HomeController', function ($scope, $location, notification) {
    $("#main-nav-tabs").hide();
    
    // login user and redirect to tasks page
    $scope.login = function () {
        $('#btn-login').prop('disabled', true);
        $('#div-login-password').removeClass('has-error');
        $('#div-login-password').removeClass('has-error');
        let data = {
            username: $('#inp-login-username').val().trim(),
            password: $('#inp-login-password').val().trim()
        }

        if (data.username.length === 0) {
            $('#div-login-username').addClass('has-error');
            return;
        }
        if (data.password.length === 0) {
            $('#div-login-password').addClass('has-error');
            return;
        }
        // show loading screen animation
        $(".overlay, .overlay-loading-animation").show();

        $.ajax({
            method: 'POST',
            url: '/login',
            data: data,
            statusCode: {
                200: (xhr) => {
                    notification.success('Login successful!');
                    sessionStorage['currentUser'] = xhr.username;
                    sessionStorage['fullname'] = xhr.fullname;
                    $(".overlay, .overlay-loading-animation").hide();
                    //$("#main-nav-tabs").show(350);
                    $('#btn-login').prop('disabled', false);
                    $location.path('/user/current/tasks').replace();
                    $scope.$apply();
                },
                401: () => {
                    $(".overlay, .overlay-loading-animation").hide();
                    notification.error('Login Failed');
                    $('#inp-login-username').val('');
                    $('#inp-login-password').val('');
                    $('#btn-login').prop('disabled', false);
                },
                400: () => {
                    $(".overlay, .overlay-loading-animation").hide();
                    notification.info('Enter your username and password first!');
                    $('#inp-login-username').val('');
                    $('#inp-login-password').val('');
                    $('#btn-login').prop('disabled', false);
                }
            }
        });
    }

    // signup a new user
    $scope.signup = function () {
        // on front page
    }
});