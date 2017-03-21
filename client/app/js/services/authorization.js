// Get authenticated user or check if user is authenticated

app.service('authorization', function() {
    return {
        isLoggedIn: () => {
            return sessionStorage['currentUser'] !== undefined;
        },
        getUser: () => {
            return sessionStorage['currentUser'];
        }
    }
});