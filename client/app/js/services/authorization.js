// Get authenticated user or check if user is authenticated

app.service('authorization', function ($q, ajax) {
    return {
        isLoggedIn: () => {
            let deferred = $q.defer();
            if (sessionStorage['currentUser']) {
                deferred.resolve(sessionStorage['currentUser']);
            } else {
                ajax.get('/user/', {}).then((user) => {
                    if (user) {
                        sessionStorage['currentUser'] = user.Username;
                        sessionStorage['fullname'] = user.FullName;
                        deferred.resolve(true);
                    } else {
                        deferred.reject(false);
                    }
                }, (err) => {
                    deferred.reject(false);
                });
            }
            return deferred.promise;
        },
        getUser: () => {
            let deferred = $q.defer();
            if (sessionStorage['currentUser']) {
                deferred.resolve( {
                    Username: sessionStorage['currentUser'],
                    FullName: sessionStorage['fullname']
                });
            } else {
                ajax.get('/user/', {}).then((user) => {
                    if (user) {
                        sessionStorage['currentUser'] = user.Username;
                        sessionStorage['fullname'] = user.FullName;
                        deferred.resolve(user);
                    } else {
                        deferred.reject(false);
                    }
                }, (err) => {
                    deferred.reject(err);
                });
            }

            return deferred.promise;
        }
    }
});