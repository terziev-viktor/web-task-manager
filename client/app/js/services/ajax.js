
app.service('ajax', function ($q) {
    return {
        get: (URL, sch) => {
            let deferred = $q.defer();
            $.ajax({
                method: 'GET',
                url: URL,
                success: (data) => {
                    deferred.resolve(data);
                },
                error: (err) => {
                    deferred.reject(err);
                },
                statusCode: sch
            });
            return deferred.promise;
        },
        post: (URL, DATA, sch) => {
            let deferred = $q.defer();
            $.ajax({
                method: 'POST',
                url: URL,
                data: DATA,
                success: (d) => {
                    deferred.resolve(d);
                },
                error: (e) => {
                    deferred.reject(e);
                },
                statusCode: sch
            });
            return deferred.promise;
        }
    }
});