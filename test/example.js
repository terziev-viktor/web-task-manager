// install dependency:
// npm install -g mocha

// start tests:
// `npm test` or `mocha`

const request = require('supertest');

describe('loading express', function () {
    let server;
    beforeEach(function () {
        delete require.cache[require.resolve('../server/index')];
        server = require('../server/index');
    });
    afterEach((done) => {
        server.close(done);
    });
    it('responds to /', (done) => {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('404', (done) => {
        request(server)
            .get('/foo')
            .expect(404, done);
    });
});
