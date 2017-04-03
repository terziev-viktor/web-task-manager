module.exports = (express, app, auth, pathToClientFolder) => {
    const path = require('path');

    // initialize static paths that require authentication
    app.use('/scripts', auth);
    app.use('/scripts', express.static(path.join(pathToClientFolder, '/app/', '/js')));
    app.use('/styles', auth);
    app.use('/styles', express.static(path.join(pathToClientFolder, '/app/', '/css')));
    app.use('/templates', auth);
    app.use('/templates', express.static(path.join(pathToClientFolder, '/app/', '/templates')));

    // initialize public static paths
    app.use('/fonts', express.static(path.join(pathToClientFolder, '/app/', '/fonts')));
    app.use('/components', express.static(path.join(pathToClientFolder, '/bower_components')));
    app.use('/images', express.static(path.join(pathToClientFolder, '/app/', '/img')));
    app.use('/favicon', express.static(path.join(pathToClientFolder, '/app/', '/img/', '/icons', '/favicon.ico')));
    app.use('/frontpage', express.static(path.join(pathToClientFolder, '/frontpage')));
}