
app.service('authorization', function() {
    return {
        isLoggedIn: () => {
            console.log('user:::');
            console.log(sessionStorage['currentUser']);
            return sessionStorage['currentUser'] != undefined;
        },
        getUser: () => {
            return sessionStorage['currentUser'];
        }
    }
});