require('dotenv').config;
const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const exerciseSchema = new Schema();

const logSchema = new Schema({
  log: [Object]
})

const userSchema = new Schema({
  username: {type: String, required: true}
});

const Log = mongoose.model('Log', logSchema);
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
    console.log('isNan');
    date = Date.now();
  }
  const newExercise = {...exercise, date: date};
  User.findById(userId, (err, foundUser) => {
    if (err) console.error(err);
    if (!foundUser) done(null, {error: 'No User Found!'});
    Log.findById(userId, (err, foundLog) => {
      let currLog;
      if (!foundLog) {
        currLog = new Log({_id: userId, log: []})
      } else {
        currLog = foundLog;
      }
      currLog.log.push(newExercise);
      currLog.save((err, savedLog) => {
        if (err) console.log(err);
        done(null, {...foundUser._doc, ...newExercise});
      });
    });
  })
};

const getExerciseLog = (options, done) => {
  const {userId, from, to, limit} = options;
  User.findById(userId, (err, foundUser) => {
    if (err) console.error(err);
    let result = Object.assign({}, foundUser._doc);
    Log.findById(userId, (err, foundLog) => {
      if (err) console.error(err);
      if (from && to) {
        result.log = foundLog.log.filter(exercise => exercise.date >= new Date(from) && exercise.date <= new Date(to));
      }
      if (limit) {
        result.log = result.log.slice(undefined, limit);
      }
      result.count = result.log.length;
      done(null, result);
    });
  });
};

module.exports = {createAndSaveUser, getAllUsers, addExercise, getExerciseLog};