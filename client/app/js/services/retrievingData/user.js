app.service('userData', function (ajax, $q) {
    this.getColleagues = (from, size, statusHandler) => {
        let deferred = $q.defer();
        ajax.get('/user/colleagues?from=' + from + "&size=" + size, statusHandler)
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
});