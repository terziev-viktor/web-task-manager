'use strict';

// The AppController holds the presentation logic for the entire app (common all screens)
app.controller('AppController', ['$scope', '$location', 'notification',
    function ($scope, $location, notification) {
        $('#search-found').hide();

        $scope.hide_search = () => {
            $('#search-found').hide(500);
        }

        $scope.searchCollegues = () => {
            let search = $('#inp-search-colleagues').val();
            console.log('search');
            console.log(search);
            if (search.length > 0) {
                $.ajax({
                    method: 'GET',
                    url: '/search?text=' + search,
                    statusCode: {
                        500: (xhr) => {
                            $location.path('/err').replace();
                            $scope.$apply();
                        }
                    },
                    success: (data) => {
                        console.log(data);
                        let inner_html = '<ul>';
                        if (data.length > 0) {
                            data.forEach((element) => {
                                inner_html += '<li><a href="#/user/community/' + '">' + element.Username + '</a></li>';
                            });
                        } else {
                            inner_html += '<span>No search results for "' + search + '"</span>';
                        }

                        inner_html += '</ul>';
                        $('#search-found-content').html(inner_html);
                        $('#search-found').show(500);
                    }
                });
            }
        }

        $scope.logout = () => {
            $.ajax({
                method: 'GET',
                url: '/logout',
                success: () => {
                    notification.info("Logout successful");
                    $location.path('/');
                    $scope.$apply();
                }
            });
        }


    }]
);
