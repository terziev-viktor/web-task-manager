app.controller('AppCtrl', function ($scope, $location, notification, statusCodeHandler, ajax, socket, loadingHtml) {
    let statusHandler = statusCodeHandler($scope);
    
    // displaying filtered users on the modal
    $scope.searchCollegues = () => {
        let search = $('#inp-search-colleagues').val();
        $('#inp-search-colleagues').val('');
        if (search.length > 0) {
            $('#modal-title').text("Loading");
            $('#modal-content').html(loadingHtml);

            ajax.get('/search?text=' + search, statusHandler)
                .then((data) => {
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
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('fullname');
                $location.path('/');
                location.reload();
            }, (err) => {
                console.log('logout error');
                console.log(err);
                notification.error('Server error accured while trying to log out...');
            });
    }
});