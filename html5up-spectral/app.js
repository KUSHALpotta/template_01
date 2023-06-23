const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, 'static')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB Atlas
mongoose
  .connect(
    'mongodb+srv://koushiksis20:fmnEl1raBb8GveKX@cluster0.zyfvp75.mongodb.net/template', // Replace with your actual MongoDB Atlas connection string
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const formDataSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const FormData = mongoose.model('FormData', formDataSchema);

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});