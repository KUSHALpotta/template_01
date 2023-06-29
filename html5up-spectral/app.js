const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Add bcrypt library
const User = require("./model/user");
const ejs = require("ejs");

const mongoURI =
  "mongodb+srv://kushalkumar:9MThSRtR3oSX2Gk6@cluster0.rwgu7vx.mongodb.net/template?retryWrites=true&w=majority";

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

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
app.post("/signup", async (req, res) => {
  // ... existing code for signup

  try {
    // ... existing code for signup

    const savedUser = await newUser.save();

    res.json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

app.post("/submit", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Passwords match, send the profile.html file with user details
      const filePath = path.join(__dirname, "static", "profile.html");
      res.sendFile(filePath, {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
      });
    } else {
      // Passwords do not match
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/admin", async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin", { user: users });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/index.html"));
});
