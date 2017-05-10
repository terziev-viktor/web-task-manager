module.exports = (db, upload) => {
    const router = require('express').Router(),
        path = require('path');

    // Upload avatar of user
    // TODO: Should delete old avatar!!!
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
                let _path = path.join(__dirname, "/../", "/../", files[0].Path);
                res.sendFile(_path);
            } else {
                res.status(404).json({
                    msg: 'File not found'
                });
            }
        });
    });

    // Upload task description files
    router.post('/single/descfiles', upload.single('file'), (req, res) => {
        console.log('req.file single/descfiles');
        console.log(req.file);
        db.files.insertTaskDesc(req.query.taskId, req.file, (err, rec) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not upload file'
                });
                return;
            } else {
                res.status(200).json({
                    msg: 'File uploaded'
                });
            }
        });
    });

    router.get('/taskdesc', (req, res) => {
        db.files.getTaskDesc(req.query.taskId, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not retrieve files'
                });
                return;
            } else {
                console.log('db.files.get.taskDesc');
                console.log(recordset);
                res.json(recordset);
            }
        });
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
                res.status(200).json(recordset);
            }
        });
    });

    router.post('/delete', (req, res) => {
        db.files.delete(req.body, (err, r) => {
            if (err) {
                console.log('/delete file error');
                console.log(err);
                res.status(500).json({
                    msg: 'Could not delete file'
                });
                return;
            } else {
                res.status(200).json({
                    msg: "File removed."
                });
            }
        })
    });

    return router;
}