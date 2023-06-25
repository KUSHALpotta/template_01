const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://kushalkumar:9MThSRtR3oSX2Gk6@cluster0.rwgu7vx.mongodb.net/template?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        // Start the server
        app.listen(port, () => {
            console.log(`Express listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });

// Handle form submission
app.post('/signup', (req, res) => {
    const { fullName, username, email, phoneNumber, password, confirmPassword, gender } = req.body;

    const newUser = new User({
        fullName,
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
        gender,
    });

    newUser.save()
        .then(savedUser => {
            res.json({ message: 'User registered successfully', user: savedUser });
        })
        .catch(error => {
            res.status(500).json({ error: 'An error occurred while registering the user' });
        });
});

const Schema = mongoose.Schema;

const formDataSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const FormData = mongoose.model('users', formDataSchema);

app.post('/submit', (req, res) => {
  const { email, password } = req.body;

  const formData = new FormData({
    email,
    password,
  });

  formData
    .save()
    .then(() => {
      res.send('Form data saved successfully');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('An error occurred');
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './static/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './static/login.html'));
});
