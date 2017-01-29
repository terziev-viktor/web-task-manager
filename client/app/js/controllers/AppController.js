'use strict';

// The AppController holds the presentation logic for the entire app (common all screens)
app.controller('AppController', ['$scope', '$location', 'notification',
    function ($scope, $location, notification) {
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
                            console.log(xhr);
                            $location.path('/err').replace();
                            $scope.$apply();
                        }
                    },
                    success: (data) => {
                        console.log(data);
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
