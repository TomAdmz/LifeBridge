var request = require('supertest');
var server = request.agent('http://localhost:50000');

describe('GET /findmatch', function(){
    it('login', loginUser());
    it('url that requires user to be logged in', function(done){
    server
        .get('/findmatch')                       
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            console.log(res.body);
            done()
        });
    });
});


function loginUser() {
    return function(done) {
        server
            .post('/login')
            .send({ email: 'tdawg', password: 't' })
            .expect(302)
            .expect('Location', '/')
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};
