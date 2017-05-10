module.exports = (db, upload) => {
    const router = require('express').Router(),
        path = require('path');

    // Upload avatar of user
    router.post('/avatar', upload.single('avatar'), (req, res) => {
        console.log('req.file');
        console.log(req.file);
        db.files.insertAvatar(req.user.Username, req.file, (err, r) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not insert file'
                });
                return;
            } else {
                res.status(200).json({
                    msg: 'Avatar uploaded',
                    data: r
                });
            }
        });
    });

    router.get('/avatar', (req, res) => {
        db.files.getAvatar(req.user.Username, (err, files) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not retrieve avatar'
                });
                return;
            } else if (files[0] !== undefined) {
                //console.log(files);
                console.log('will be sent');
                let _path = path.join(__dirname, "/../", "/../", files[0].Path);

                console.log(_path);
                res.sendFile(_path);
            } else {
                res.status(404).json({
                    msg: 'File not found'
                });
            }
        });
    });

    // Upload task description files
    router.post('/descfiles', upload.any(), (req, res) => {
        console.log('req.files');
        console.log(req.files);
        // db.files.insertTaskDesc(req.body.id, req.files, (err, rec) => {
        //     if (err) {
        //         console.log(err);
        //         res.status(500).json({
        //             msg: 'Could not insert files'
        //         });
        //         return;
        //     } else {
        //         res.status(200).json({
        //             msg: 'Files uploaded'
        //         });
        //     }
        // });
        res.status(200);
    });

    // upload comments files
    router.post('/commentdesc', upload.array('files', 100), (req, res) => {
        console.log('req.file');
        console.log(req.files);
        db.files.insertCommentDesc(req.body.id, req.files, (err, rec) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not insert files'
                });
                return;
            } else {
                res.status(200).json({
                    msg: 'Files uploaded'
                });
            }
        });
    });

    router.get('/commentdesc', (req, res) => {
        db.files.getCommentDesc(req.body.id, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not retrieve files'
                });
                return;
            } else {
                console.log(recordset);
            }
        });
    });

    router.get('/taskdesc', (req, res) => {
        db.files.getCommentDesc(req.body.id, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not retrieve files'
                });
                return;
            } else {
                console.log('/taskdesc');
                console.log(recordset);
            }
        });
    });
    return router;
}