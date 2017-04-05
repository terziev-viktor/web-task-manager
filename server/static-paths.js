module.exports = (express, app, auth, pathToClientFolder) => {
    const path = require('path');

    // initialize static paths that require authentication
    app.use('/app', auth);
    app.use('/app/scripts', express.static(path.join(pathToClientFolder, '/app/', '/js')));
    app.use('/app/styles', express.static(path.join(pathToClientFolder, '/app/', '/css')));
    app.use('/app/templates', express.static(path.join(pathToClientFolder, '/app/', '/templates')));

    // initialize public static paths
    app.use('/components', express.static(path.join(pathToClientFolder, '/bower_components')));
    app.use('/public', express.static(path.join(pathToClientFolder, '/public')));
    
    // favicon
    app.get('/favicon', (req, res) => res.sendFile(path.join(pathToClientFolder, '/public/', '/img/', '/icons/', '/favicon.ico')));

    app.get('/', (req, res) => {
        if (req.isAuthenticated()) {
            res.sendFile(path.join(pathToClientFolder, '/app/', '/index.html'));
        } else {
            res.sendFile(path.join(pathToClientFolder, '/public/', '/frontpage/', '/index.html'));
        }
    });
}