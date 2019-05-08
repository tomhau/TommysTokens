
// BASE FOR THE SERVER 
var express = require('express');

const cors = require('cors');
var app = express();
app.use(cors());

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var urlencode = bodyParser.urlencoded({ extended: true });
app.use(express.static('public'));
app.use(bodyParser.json());

// JWT
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// MAKE DB CONNECTION

mongoose.connect('mongodb://localhost:27017/zooDB');

// MODELS (NOTICE THIS IS IN ANOTHER FOLDER)

var Rabbit = require('./models/rabbit');
var User = require('./models/user');

// ROUTING

var router = express.Router();

// TO PROCESS THE NEXT REQUEST !!

router.use(function (req, res, next) {
    console.log("debug,  http request recieved...");
    next();
});

app.use('/', router); 



router.route('/rabbits')
    .get( function (req, res) {
        Rabbit.find({},{ _id:0},function (err, rabbits) {
            if (err)
                res.send(err);
            res.status(200).json(rabbits);
        });
    })
    
    .post(function (req, res) {
        var rabbit = new Rabbit(req.body);
        console.log('debug: the object : ' + JSON.stringify(rabbit));
        rabbit.save(function (err) {
            if (err)
                res.send(err);
            res.status(201).json(rabbit);
        });
    });

router.route('/rabbits/:rabbit_id')
    .get(function (req, res) {
        Rabbit.findOne({ id: req.params.rabbit_id }, {_id:0}, function (err, rabbit) {
            if (err)
                res.status(500).send(err);
            res.status(200).json({ rabbit });
        });
    })
router.route('/logon')
    .post(function(req, res) {
        var userBody = new User(req.body);
        console.log('debug: userBody : ' + JSON.stringify(userBody));
        var user = User.findOne({userName:userBody.userName}, function (err, user) {
            if (err){
                console.log('error');
            }
            console.log('debug: user : ' + JSON.stringify(user));
            
            if( userBody.password != user.password){
                res.status(403).send(err);
            }else{
                var token = jwt.sign({role: user.role}, 'secret', {expiresIn: '1h'});
                res.status(200).send({token});
            }
        
        }); 
        
      });

// SERVER START

app.listen(4040, () => {
    console.log('We are now listening on port 4040 (serverside)');
});


