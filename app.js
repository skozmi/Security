//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Username must be inserted']
    },
    password: {
        type: String,
        require: [true, 'Password must be inserted']
    }
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res, next)=>{
    res.render('home');
});

app.get('/login', (req, res, next)=>{
    res.render('login');
});

app.post('/login', (req, res, next)=>{
    let email = req.body.username;
    let password = req.body.password;
    User.findOne({email: email}, (err, foundUser)=>{
        if(err){
            res.send(err);
        } else {
            if(!foundUser){
                res.send('Incorrect email input');
            } else {
                if(foundUser.password === password){
                    res.render('secrets');
                } else {
                    res.send('Incorrect password input');
                }
            }
        }
    })
})

app.get('/register', (req, res, next)=>{
    res.render('register');
});

app.post('/register', (req, res, next)=>{
    let email = req.body.username;
    let password = req.body.password;
    let user = new User({
        email: email,
        password: password
    });
    user.save(err=>{
        if(err){
            res.send(err);
        } else {
            res.render('secrets');
        }
    });
})











app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}.`);
});
