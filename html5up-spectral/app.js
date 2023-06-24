
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const { MongoClient } = require("mongodb");

const mongoURI = "<connection-string>";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static")));

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    // Start the server
    app.listen(port, () => {
      console.log(`Express listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

// Handle form submission
app.post("/signup", (req, res) => {
  const {
    fullName,
    username,
    email,
    phoneNumber,
    password,
    confirmPassword,
    gender,
  } = req.body;

  const newUser = new User({
    fullName,
    username,
    email,
    phoneNumber,
    password,
    confirmPassword,
    gender,
  });

  newUser
    .save()
    .then((savedUser) => {
      res.json({ message: "User registered successfully", user: savedUser });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    });
});

app.post("/submit", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Successful login
    res.send(`Welcome ${email}`);
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/index.html"));
=======
app.use(express.static(path.join(__dirname, 'static')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB Atlas
mongoose
  .connect(
    'mongodb+srv://koushiksis20:<password>@cluster0.zyfvp75.mongodb.net/template', // Replace with your actual MongoDB Atlas connection string
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
