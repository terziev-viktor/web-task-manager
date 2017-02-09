
app.service('statusCodeHandler', function (notification, $location) {
    return (scope) => {
        return {
            500: (xhr) => {
                notification.error(xhr.responseJSON.msg);
            },
            403: (xhr) => {
                notification.warning('Forbiddent symbols (\' -- ) used.');
            },
            401: (xhr) => {
                notification.info('Signup or login in to your profile first :-)');
                $location.path('/');
                scope.$apply();
            },
            200: (xhr) => {
                if (xhr.responseJSON) {
                    notification.success(xhr.responseJSON.msg);
                }
            }
        }
    }
});
