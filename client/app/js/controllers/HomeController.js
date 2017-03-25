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
        $('#btn-signup').prop('disabled', true);
        $('#div-signin-username').removeClass('has-error');
        $('#div-signin-password').removeClass('has-error');
        $('#div-signin-confirm').removeClass('has-error');
        $('#div.signin-fullname').removeClass('has-error');
        let data = {
            username: $('#inp-signin-username').val().trim(),
            password: $('#inp-signin-password').val().trim(),
            fullname: $('#inp-signin-fullname').val().trim(),
            confirm: $('#inp-signin-confirm').val().trim()
        }
        if (data.fullname.length === 0) {
            $('#div-signin-fullname').addClass('has-error');
            $('#btn-signup').prop('disabled', false);
            return;
        }

        // show loading screen
        $(".overlay, .overlay-loading-animation").show();

        $.ajax({
            method: 'POST',
            url: '/signin',
            data: data,
            statusCode: {
                200: (xhr) => {
                    notification.success('Signup successful. You can login now.');
                    $('#inp-signin-username').val('');
                    $('#inp-signin-fullname').val('');
                    $('#inp-signin-password').val('');
                    $('#inp-signin-confirm').val('');
                    $('#btn-signup').prop('disabled', false);
                    // hide loading screen
                    $(".overlay, .overlay-loading-animation").hide();
                },
                500: (xhr) => {
                    notification.error(xhr.responseJSON.msg);
                    if (xhr.responseJSON.errCode == 0) {
                        // pass and confirm mismatch
                        $('#div-signin-password').addClass('has-error');
                        $('#div-signin-confirm').addClass('has-error');
                    } else if (xhr.responseJSON.errCode == 1) {
                        // pass pattern not satisfied
                        $('#div-signin-password').addClass('has-error');
                    } else if (xhr.responseJSON.errCode == 2) {
                        // username taken
                        $('#div-signin-username').addClass('has-error');
                        $('#inp-signin-password').val('');
                    }

                    $('#inp-signin-password').val('');
                    $('#inp-signin-confirm').val('');
                    $('#btn-signup').prop('disabled', false);
                }
            }
        })
    }
});