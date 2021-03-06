module.exports = (db, upload) => {
    const router = require('express').Router(),
        path = require('path');

    // Upload avatar of user
    // TODO: Should delete old avatar!!!
    router.post('/avatar', upload.any(), (req, res) => {
        console.log(req.file);
        console.log(req.files);
        if (!req.files[0].mimetype.includes("image")) {
            res.status(400).json({
                msg: "Avatars can only be images."
            });
            return;
        }
        db.files.insertAvatar(req.user.Username, req.files[0], (err, r) => {
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
        let avatarDbQueryHandler = (err, files) => {
            if (err) {
                let _path = path.join(__dirname, '/../', '/../', '/client/', '/public/', '/img/', '/default-avatar.jpg');
                res.sendFile(_path);
                return;
            } else if (files[0] !== undefined) {
                let _path = path.join(__dirname, '/../', '/../', files[0].Path);
                res.sendFile(_path);
            } else {
                let _path = path.join(__dirname, '/../', '/../', '/client/', '/public/', '/img/', '/default-avatar.jpg');
                res.sendFile(_path);
            }
        }

        if (req.query.username !== undefined) {
            db.files.getAvatar(req.query.username, avatarDbQueryHandler);
        } else {
            db.files.getAvatar(req.user.Username, avatarDbQueryHandler);
        }

    });

    // Upload task description files
    router.post('/single/descfiles', upload.single('file'), (req, res) => {
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

    router.post('/many/descfiles', upload.any(), (req, res) => {
        req.files.forEach(function (e) {
            db.files.insertTaskDesc(req.query.taskId, e, (err, rec) => {
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
        }, this);

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
                res.status(200).json(recordset);
            }
        });
    });

    // upload comments files
    router.post('/many/commentdesc', upload.any(), (req, res) => {
        if (!req.query.commentId) {
            res.status(400).json({
                msg: "Need id of comment"
            });
            return;
        }
        if (!req.files || req.files.length == 0) {
            return;
        }
        req.files.forEach(function (e) {
            db.files.insertCommentDesc(req.query.commentId, e, (err, rec) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not insert files'
                    });
                } else {
                    res.status(200).json({
                        msg: 'Files uploaded'
                    });
                }
            });
        }, this);
    });

    router.get('/commentdesc', (req, res) => {
        db.files.getCommentDesc(req.query.commentId, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not retrieve files'
                });
                return;
            } else {
                console.log('----------------------------------------------');
                console.log(req.query.commentId);
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