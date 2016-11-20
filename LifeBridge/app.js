var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var request = require('request');
var bodyParser = require('body-parser');

var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'sql3.freemysqlhosting.net',
  user: 'sql3145356',
  port: '3306',
  password: 'UyvFaKi8rz',
  database: 'sql3145356'
});


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 50000);

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

app.get('/', function(req, res) {
  res.render('home');
  getConnection();
}); 


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  //res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});