const express = require("express");

const app = express();

// Body parser middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api", function (req, res) {
    console.log(req.body);
    res.send("Hello World");
});

app.listen(8080);
