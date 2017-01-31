// TODO: 

const containsSqlInjection = (str) => {
        const sql_meta = new RegExp('(%27)|(\')|(--)|(%23)|(#)', 'i');
        const sql_meta2 = new RegExp('((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))', 'i');
        const sql_typical = new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'i');
        const sql_union = new RegExp('((%27)|(\'))union', 'i');
        return (sql_meta.test(str) || sql_meta2.test(str) || sql_typical.test(str) || sql_union.test(str));
}

module.exports = (req, res, next) => {
    // check for sql injection in the url
    if (containsSqlInjection(req.originalUrl)) {
        res.sendStatus(403).end();
        return;
    }

    // check for sql injection in the body
    if (!req.body) {
        // TODO: throw err?
        console.warn('sql-validation: body is not parsed');
    } else {
        const strBody = JSON.stringify(req.body);
        if (containsSqlInjection(strBody)) {
            res.sendStatus(403).end();
            return;
        }
    }

    next();
}