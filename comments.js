// create web server
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

// database connection
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'jsman'
});
connection.connect();

// set router
router.post('/form', function(req, res) {
    console.log(req.body);
    res.render('email.ejs', {'email': req.body.email});
});

router.post('/ajax', function(req, res) {
    var email = req.body.email;
    var resData = {};

    var query = connection.query('select name from user where email="' + email + '"', function(err, rows) {
        if(err) throw err;
        if(rows[0]) {
            resData.result = "ok";
            resData.name = rows[0].name;
        } else {
            resData.result = "none";
            resData.name = "";
        }
        res.json(resData);
    });
});

module.exports