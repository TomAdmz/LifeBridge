var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'sql3.freemysqlhosting.net',
  user: 'sql3145356',
  port: '3306',
  password: 'UyvFaKi8rz',
  database: 'sql3145356'
});

connection.query('SELECT * from users', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});
/*
var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
          throw(err);
        } else {
          console.log('not an error');
        }
        connection.release();
    });
};
*/
//===============EXPRESS================

app.use(express.static('public'));
app.use(flash());
//app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));


//===============PASSPORT===============
// used to serialize the user for the session
//passport.serializeUser(function(user, done) {
//  done(null, user.id);
//});
// used to deserialize the user
//passport.deserializeUser(function(id, done) {
//  connection.query("select * from users where userID = ?",[id],function(err,rows){ 
//    console.log('de rows' + rows);
//    done(err, rows[0]);
//  });
//});
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    connection.query("select * from users where userName = ?", [email],function(err,rows){
      console.log(rows);
      console.log("above row object");
      if (err)
        return done(err);
       if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That e-mail is already taken.'));
        } else {

        // if there is no user with that email
                // create the user
          var newUserMysql = new Object();
        
          newUserMysql.userName = email;
          newUserMysql.pword =  password; // use the generateHash function in our user model
          newUserMysql.fname = req.body.fname;
          newUserMysql.lname = req.body.lname;
          newUserMysql.stat = req.body.stat;
      
          var insertQuery = "INSERT INTO users ( userName, pword, fname, lname, stat ) values (?, ?, ?, ?, ?)";
          console.log(insertQuery);
          connection.query(insertQuery, [email, password, req.body.fname, req.body.lname, req.body.stat], function(err,rows){
            newUserMysql.id = rows.insertId;
        
            return done(null, newUserMysql);
          }); 
            } 
    });
})
);

//user login strategy
passport.use('local-signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            connection.query("select * from users where userName = ?", [email],function(err,rows){
                console.log(rows);
                if (err) {
                    console.log('error');
                    return done(err);
                } if (!rows.length) {
                    console.log('no user');
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (password != rows[0].pword) {//(!bcrypt.compareSync(password, rows[0].pword)) {
                    console.log('bad pass');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                } 
                // all is well, return successful user
                console.log('OK');
                return done(null, rows[0]);
            });
        })
);

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 50000);


//===============ROUTES===============

app.get('/', function(req, res) {
  //res.render('home');
  res.render('home', {user: req.user});
}); 

//displays our signup page
app.get('/signin', function(req, res){
  res.render('signin', { message: req.flash('signupMessage') });
});
//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/signin'
  }),
  function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
  }
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
  var name = req.user.fname;
  console.log("LOGGING OUT " + req.user.userName)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

//edit data form
app.get('/editForm', function(req, res){
	res.render('edit',{user: req.user}); //render editform page with prepopulated table data
  });

  app.get('/edit', function(req, res, next) {
	  console.log(req.query.fname);
	  console.log(req.query.lname);
	  console.log(req.query.userID);
	  connection.query("UPDATE users SET fname=?, lname=?, pword=? WHERE userID =?", [req.query.fname, req.query.lname, req.query.pword, req.query.userID], function(err, result){
	  
	 if(err){
		  next(err);
		  return;
	  }
	  
	  var user = req.user;
	  user.fname=req.query.fname;
	  user.lname=req.query.lname;
	  user.pword=req.query.pword;
	  req.logIn(user, function(error){
			if (!error){
				console.log("good stuff");
			}
	  });
	  res.render('home', {user: req.user})
	  
  });
  
  });
  
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

//===============PORT=================
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
