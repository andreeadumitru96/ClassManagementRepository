/**
 * Created by Andreea on 4/14/2017.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

var mongoose = require('mongoose');
var Student = require('./Student.model');
var db = 'mongodb://root:root@ds139791.mlab.com:39791/class-management';

mongoose.Promise = global.Promise;
mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/students', function(req, res){
    Student.find({}).exec(function(err, students){
        if(err) {
            res.send("Couldn`t obtain students list");
        }
        else {
            res.json(students);
        }
    })
});


app.post('/saveStudent', function(req, res){
    Student.create(req.body, function(err, stundent){
        if(err){
            res.send('Couldn\'t save student');
        }
        else {
            res.send(stundent);
        }
    })
});

app.delete('/deleteStudent/:id', function(req, res){
    Student.findOneAndRemove({
        _id: req.params.id
    }, function (err, student) {
        if(err){
            res.send('Couldn\'t delete the student');
        }
        else{
            res.send(student);
            console.log(student);
        }
    });
});


app.put('/editStudent/:id', function(req, res) {
    Student.findOneAndUpdate({
        _id: req.params.id
    },
        {$set: {firstName: req.body.firstName,
                lastName: req.body.lastName,
                englishGrade: req.body.englishGrade,
                mathGrade: req.body.mathGrade}
                },
        {new: true},
        function(err, student) {
            if (err) {
                res.send('Couldn\'t edit the student');
            }
            else {
                res.send(student);
                console.log(student);
            }
        }
    );

});

app.set('view engine', 'ejs');

app.get('/index', function (req, res) {
    res.render('templates/index');
});

app.use(express.static(__dirname + '/public'));

app.listen(port);
