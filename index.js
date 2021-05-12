const express = require("express");
const uuid = require("uuid");
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

const app = express();

const db = new JsonDB(new Config("database", true, false, "/"));
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to 2 factor Authentication" });
});

app.listen(5000, () => {
  console.log("Example app listening on port 5000!");
});

//Run app, then load http://localhost:5000 in a browser to see the output.
