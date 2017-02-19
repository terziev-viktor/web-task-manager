app.controller('AppController', function ($scope, $location, notification, statusCodeHandler, ajax, socket) {
    let statusHandler = statusCodeHandler($scope);
    $scope.searchCollegues = () => {
        let search = $('#inp-search-colleagues').val();
        $('#inp-search-colleagues').val('');
        if (search.length > 0) {
            ajax.get('/search?text=' + search, statusHandler)
                .then((data) => {
                    console.log(data);
                    let inner_html = '<ul class="list-group">';
                    if (data.length > 0) {
                        data.forEach((element) => {
                            inner_html += '<li class="list-group-item"><a href="#/user/' + element.Username + '">' + element.Username + '</a></li>';
                        });
                    } else {
                        inner_html += '<li class="list-group-item">No search results for "' + search + '"</li>';
                    }

                    inner_html += '</ul>';
                    $('#modal-title').html("Found Users");
                    $('#modal-content').html(inner_html);
                });
        }
    }

    $scope.logout = () => {
        ajax.get('/logout', statusHandler)
            .then(() => {
                notification.info("Logout successful");
                sessionStorage['currentUser'] = undefined;
                $location.path('/');
                $scope.$apply();
            });
    }
});