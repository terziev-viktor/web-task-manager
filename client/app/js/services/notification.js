// noty config
$.noty.defaults.dismissQueue = false;
$.noty.defaults.theme = 'bootstrapTheme';
$.noty.defaults.timeout = 1000;

// notification service for messages to user
app.service('notification', [function () {
    return {
        info: (msg) => {
            noty({
                text: msg,
                type: 'info',
                layout: 'topCenter',
                timeout: 1000
            });
        },
        warning: (msg) => {
            noty({
                text: msg,
                type: 'warning',
                layout: 'topCenter',
                timeout: 1000
            });
        },
        success: (msg) => {
                noty({
                text: msg,
                type: 'success',
                layout: 'topCenter',
                timeout: 1000
            });
        },
        alert: (msg) => {
            noty({
                text: msg,
                type: 'alert',
                layout: 'bottonRight',
                timeout: 1000
            });
        },
        error: (msg) => {
            noty({
                text: msg,
                type: 'error',
                layout: 'topLeft',
                timeout: 2000
            });
        }
    }
}]);