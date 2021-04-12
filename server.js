const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
let mongoose;
try {
  mongoose = require('mongoose');
} catch (e) {
  console.log(e);
}
const router = express.Router();
const {createAndSaveUser, getAllUsers} = require('./myApp');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/exercise/new-user', (req, res) => {
  const {username} = req.body;
  createAndSaveUser(username, (err, results) => res.status(201).json({_id: results._id, username: results.username}));
});

app.get('/api/exercise/users', (req, res) => {
  getAllUsers((err, results) => res.status(200).json(results));
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
