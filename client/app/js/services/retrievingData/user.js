app.service('userData', function (ajax, $q, authorization) {
    this.getColleagues = (from, size, statusHandler) => {
        let deferred = $q.defer();
        ajax.get('/user/colleagues?relational=1&from=' + from + "&size=" + size, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getEmployees = (from, size, statusHandler) => {
        let deferred = $q.defer();
        ajax.get('/user/employees?from=' + from + '&size=' + size, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getManagers = (from, size, statusHandler) => {
        let deferred = $q.defer();
        ajax.get('/user/managers?from=' + from + '&size=' + size, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getColleague = (username, statusHandler) => {
        let deferred = $q.defer();
        let currentUser = authorization.getUser();
        ajax.get('/user/colleague?username=' + username, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getColleagueTasksTodo = (username, from, size, statusHandler) => {
        let deferred = $q.defer();
        ajax.get('/tasks/todo/' + username + '?from=' + from + '&size=' + size, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getColleagueCreatedTasks = (username, from, size, statusHandler) => {
        let deferred = $q.defer();

        ajax.get('/tasks/created/' + username + '?from=' + from + '&size=' + size, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getColleagueEmployees = (username, from, size, statusHandler) => {
        let deferred = $q.defer();

        ajax.get('/user/employees/' + username + '?from=' + from + '&size=' + size, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    this.getColleagueManagers = (username, from, size, statusHandler) => {
        let deferred = $q.defer();

        ajax.get('/user/managers/' + username + '?from=' + from + '&size=' + size, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getUserRelational = (username, statusHandler) => {
        let deferred = $q.defer();

        ajax.get('/search?userRelational=' + username, statusHandler)
            .then((data) => {
                deferred.resolve(data);
            }, (err) => {
                deferred.reject(err);
            });

        return deferred.promise;
    }
});