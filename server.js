const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const {createAndSaveUser, getAllUsers, addExercise, getExerciseLog} = require('./myApp');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/exercise/new-user', (req, res) => {
  const {username} = req.body;
  createAndSaveUser(username, (err, data) => res.status(201).json({_id: data._id, username: data.username}));
});

app.get('/api/exercise/users', (req, res) => {
  getAllUsers((err, data) => res.status(200).json(data));
});

app.post('/api/exercise/add', (req, res) => {
  const body = req.body;
  const {userId} = body;
  const exercise = {description: body.description, duration: body.duration, date: body.date}
  addExercise(userId, exercise, (err, data) => res.status(201).json(data));
});

app.get('/api/exercise/log', (req, res) => {
  getExerciseLog(req.query,(err, data) => res.status(200).send(data));
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
