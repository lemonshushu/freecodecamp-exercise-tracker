require('dotenv').config;
const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const exerciseSchema = new Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: Date
});

const userSchema = new Schema({
  username: {type: String, required: true},
  log: [exerciseSchema]
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
const User = mongoose.model('User', userSchema);

const createAndSaveUser = (username, done) => {
  const newUser = new User({username: username});
  newUser.save((err, data) => {
    if (err) return console.error(err);
    done(null, data)
  });
};

const getAllUsers = (done) => {
  User.find({}, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const addExercise = (userId, exercise, done) => {
  let date = new Date(exercise.date)
  if (isNaN(date.getTime())) {
    date = Date.now();
  }
  const newExercise = new Exercise({...exercise, date: date});
  User.findById(userId, (err, data) => {
    if (err) return console.error(err);
    data.log.push(newExercise);
    data.save((err, data) => {
      if (err) return console.error(err);
      done(null, data);
    });
  });
};

const getExerciseLog = (options, done) => {
  const {userId, from, to, limit} = options;
  User.findById(userId, (err, data) => {
    if (err) console.error(err);
    let result = Object.assign({}, data._doc);
    if (from && to) {
      result['log'] = result['log'].filter(exercise => exercise.date >= new Date(from) && exercise.date <= new Date(to));
    }
    if (limit) {
      result['log'] = result['log'].slice(undefined, limit);
    }
    result.count = result['log'].length;
    done(null, result);
  });
};

module.exports = {createAndSaveUser, getAllUsers, addExercise, getExerciseLog};