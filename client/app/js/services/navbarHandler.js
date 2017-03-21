// privides functionality for handling the navbar

app.service('navbarHandler', function (authorization) {
    return {
        handle: (path) => {
            let username = authorization.getUser();
            if (username) {
                $('#sidebar-header').html(username);
            }

            $('.sidebar-option').removeClass('active');
            switch (path) {
                case "/user/current/tasks":
                    {
                        $('.sidebar-option:nth-child(1)').addClass('active');
                        break;
                    }
                case "/newTask":
                    {
                        $('.sidebar-option:nth-child(2)').addClass('active');
                        break;
                    }
                case "/user/current/community":
                    {
                        $('.sidebar-option:nth-child(3)').addClass('active');
                        break;
                    }
                case "/user/current/requests":
                    {
                        $('.sidebar-option:nth-child(4)').addClass('active');
                        break;
                    }
                case "/user":
                    {
                        $('.sidebar-option:nth-child(5)').addClass('active');
                        break;
                    }
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