var should = require('should'),
expect = require('chai').expect,
supertest = require('supertest'),
agent = supertest.agent('http://localhost:50000');

describe('Lifebridge is Running', function(){
    it('home page loads', function(done){
    agent
        .get('/')                       
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
});
describe('Lifebridge User Login Features Functioning', function(){
    it('successful login', function(done){
    agent
            .post('/login')
            .type('form')
            .send({ email: 'tdawg' })
            .send({ password: 't' })
            .expect(302)
            .expect('Location', '/')
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    });
    it('unsuccessful login', function(done){
    agent
            .post('/login')
            .type('form')
            .send({ email: 'tdawg' })
            .send({ password: 'aa' })
            .expect(302)
            .expect('Location', '/signin')
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    });
    it('unsuccessful signup', function(done){
    agent
            .post('/local-reg')
            .type('form')
            .send({ email: 'tdawg' })
            .send({ password: 'aa' })
            .expect(302)
            .expect('Location', '/signin')
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    });
    it('user profile page loads', function(done){
    agent
        .get('/')
        .type('form')                      
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
    it('messages page loads', function(done){
    agent
        .get('/messages')
        .type('form')                      
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
    it('manage matches page loads', function(done){
    agent
        .get('/manageMatches')
        .type('form')                      
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
    it('myMatches page loads', function(done){
    agent
        .get('/myMatches')
        .type('form')                      
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });

});

describe('Search Functioning', function() {

    before(function(done){
    agent
        .post('/setJob')
        .type('form')
        .send({ category: 'Arts' })
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });

    it('find match page loads', function(done){
    agent
        .get('/findMatch')
        .type('form')                      
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
    it('search results page loads', function(done){
    agent
        .get('/displayMatches')
        .type('form')                      
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
    it('user job list update successful', function(done){
    agent
        .get('/')
        .type('form')                      
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
});


describe('Logout Successful', function() {

    it('log out page loads', function(done){
    agent
        .get('/logout')
        .type('form')                      
        .expect(302)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
    it('user session erased successfully', function(done){
    agent
        .get('/messages')
        .type('form')                      
        .expect(500)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
});

