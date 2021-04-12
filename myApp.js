require('dotenv').config;
const mongoose = require('mongoose');
const {Schema} = mongoose;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const exerciseSchema = new Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: Date
});

const userSchema = new Schema({
  username: {type: String, required: true},
  exercises: [exerciseSchema]
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
const User = mongoose.model('User', userSchema);

const createAndSaveUser = (username, done) => {
  const newUser = new User({username: username});
  newUser.save((err, results) => {
    //console.log(results);
    if (err) return console.error(err);
    done(null, results)
  });
};

const getAllUsers = (done) => {
  User.find({}, (err, results) => {
    if (err) return console.log(err);
    done(null, results);
  });
};

module.exports = {Exercise, createAndSaveUser, getAllUsers};