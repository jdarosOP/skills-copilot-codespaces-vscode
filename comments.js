// create web server
// npm install express
// npm install body-parser
// npm install cookie-parser
// npm install express-session
// npm install express-myconnection
// npm install mysql
// npm install ejs
// npm install express-flash
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'comments'
};
app.use(myConnection(mysql, dbOptions, 'single'));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    req.getConnection(function (error, conn) {
        conn.query('SELECT * FROM comments', function (err, rows, fields) {
            if (err)
                throw err;
            res.render('comments', {
                title: 'Comments',
                comments: rows
            });
        });
    });
});
app.post('/', function (req, res) {
    var comment = req.body.comment;
    req.getConnection(function (error, conn) {
        conn.query('INSERT INTO comments SET ?', { comment: comment }, function (err, result) {
            if (err)
                throw err;
            req.flash('success', 'Comment added successfully.');
            res.redirect('/');
        });
    });
});
app.listen(3000, function () {
    console.log('Server is running at port 3000');
});