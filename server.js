'use strict';
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const { foodItem } = require('./models');

const app = express();
app.use(bodyParser.json());

app.use(morgan('common'));
app.use(express.static('public'));

app.use(function (req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if(req.method === 'OPTIONS'){
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', {session: false});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/foodList/protected', jwtAuth, (req,res) => {
  foodItem
    .find()
    .then(foods => {
      res.json({
        foods: foods.map(
          (food) => food.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

app.get('/foodList/:id/protected', jwtAuth, (req,res) => {
  foodItem
    .findById(req.params.id)
    .then(food => res.json(food.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

app.post('/foodList/protected', jwtAuth, (req, res) => {
  const requiredFields = ['name', 'calories'];
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  foodItem
    .create({
      name: req.body.name,
      calories: req.body.calories
    })
    .then(food => res.status(201).json(food.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

app.put('/foodList/:id/protected', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'calories'];

  updateableFields.forEach(field => {
    if(field in req.body){
      toUpdate[field] = req.body[field];
    }
  });

  foodItem
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(food => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

app.delete('/foodList/:id/protected', jwtAuth, (req, res) => {
  foodItem
    .findByIdAndRemove(req.params.id)
    .then(food => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

app.use('*', function(req,res){
  res.status(404).json({ message: 'Not found'});
});

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};