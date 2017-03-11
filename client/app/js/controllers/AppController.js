app.controller('AppController', function ($scope, $location, notification, statusCodeHandler, ajax, socket) {
    let statusHandler = statusCodeHandler($scope);

    // displaying filtered users on the modal
    $scope.searchCollegues = () => {
        let search = $('#inp-search-colleagues').val();
        $('#inp-search-colleagues').val('');
        if (search.length > 0) {
            ajax.get('/search?text=' + search, statusHandler)
                .then((data) => {
                    console.log(data);
                    let ul = jQuery('<ul/>', {
                        class: 'list-group'
                    });
                    if (data && data.length > 0) {
                        data.forEach((element) => {
                            let li = jQuery('<li/>', {
                                class: 'list-group-item'
                            }).append(jQuery('<a/>', {
                                href: '#/user/' + element.Username,
                                text: element.FullName + " (" + element.Username + ")"
                            }));
                            ul.append(li);
                        });
                    } else {
                        let li = jQuery('<li/>', {
                            class: 'list-group-item',
                            text: 'No search results for "' + search + '"'
                        });
                        ul.append(li);
                    }

                    $('#modal-title').text("Found Users");
                    $('#modal-content').empty().append(ul);
                });
        }
    }

    // logouts the current user
    $scope.logout = () => {
        ajax.get('/logout', statusHandler)
            .then(() => {
                notification.info("Logout successful");
                sessionStorage.removeItem('currentUser');
                $('#li-profile').hide(350);
                $('#li-logout').hide(350);
                $location.path('/');
                $scope.$apply();
            });
    }
});