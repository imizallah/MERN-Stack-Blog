const express = require("express");
const app = express();
// const config = require("");

// mongoDB Connection
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://imizallah:imizallah1990@react-blog-boiler-plate.o9xxp.mongodb.net/react-blog-boiler-plate?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.send("Home reach!!!!!! ")
})

// mongodb+srv://imizallah:imizallah1990@react-blog-boiler-plate.o9xxp.mongodb.net/<react-blog-boiler-plate>?retryWrites=true&w=majority

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});