// Default status code handling. Use in ajax requests.
app.service('statusCodeHandler', function (notification, $location) {
    return (scope) => {
        return {
            200: (xhr) => {
                if (xhr.responseJSON) {
                    notification.success(xhr.responseJSON.msg);
                }
                if (xhr.msg) {
                    notification.success(xhr.msg);
                }
            },
            400: (xhr) => {
                notification.error(xhr.responseJSON.msg);
            },
            401: (xhr) => {
                notification.info('Signup or login in to your profile first :-)');
                $location.path('/');
                scope.$apply();
            },
            403: (xhr) => {
                notification.warning('Forbiddent symbols (\' -- ) used.');
            },
            409: (xhr) => {
                notification.error('Conflict: ' + xhr.responseJSON.msg);
            },
            500: (xhr) => {
                notification.error(xhr.responseJSON.msg);
            }
        }
    }
});