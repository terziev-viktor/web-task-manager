module.exports = (app, db) => {
    const auth = (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    const sql_inj = (req, res, next) => {
        let sql_meta = new RegExp('(%27)|(\')|(--)|(%23)|(#)', 'i');
        if (sql_meta.test(value)) {
            res.sendStatus(403);
        }

        let sql_meta2 = new RegExp('((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))', 'i');
        if (sql_meta2.test(value)) {
            res.sendStatus(403);
        }

        let sql_typical = new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'i');
        if (sql_typical.test(value)) {
            res.sendStatus(403);
        }

        let sql_union = new RegExp('((%27)|(\'))union', 'i');
        if (sql_union.test(value)) {
            res.sendStatus(403);
        }

        return true;
        
    }

    app.get('/', (req, res) => {

        res.sendStatus(200);
        console.log(req.user);
    });

    app.post('/', function (req, res) {

    });
}