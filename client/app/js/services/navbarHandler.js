// privides functionality for handling the navbar

app.service('navbarHandler', function(authorization) {
    return {
        handle: () => {
            if(authorization.isLoggedIn() == true) {
                $('.nav-option').removeClass('disabled');
            } else {
                $('.nav-option').addClass('disabled');
            }
        },
        disableOptions: () => {
            $('.nav-option').addClass('disabled');
        },
        enableOptions: () => {
            $('.nav-option').removeClass('disabled');            
        }
    }
});