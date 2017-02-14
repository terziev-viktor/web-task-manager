
app.controller('AppController', function ($scope, $location, notification, statusCodeHandler) {
    let statusHandler = statusCodeHandler($scope);
    $scope.searchCollegues = () => {
        let search = $('#inp-search-colleagues').val();
        $('#inp-search-colleagues').val('');
        if (search.length > 0) {
            $.ajax({
                method: 'GET',
                url: '/search?text=' + search,
                success: (data) => {
                    console.log(data);
                    let inner_html = '<ul class="list-group">';
                    if (data.length > 0) {
                        data.forEach((element) => {
                            inner_html += '<li class="list-item"><a href="#/user/' + element.Username + '">' + element.Username + '</a></li>';
                        });
                    } else {
                        inner_html += '<li>No search results for "' + search + '"</li>';
                    }

                    inner_html += '</ul>';
                    $('#modal-title').html("Found Users");                    
                    $('#modal-content').html(inner_html);
                },
                statusCode: statusHandler
            });
        }
    }

    $scope.logout = () => {
        $.ajax({
            method: 'GET',
            url: '/logout',
            success: () => {
                notification.info("Logout successful");
                sessionStorage['currentUser'] = undefined;
                $location.path('/');
                $scope.$apply();
            }
        });
    }
});
