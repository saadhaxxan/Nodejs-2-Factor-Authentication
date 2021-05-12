const express = require("express");
const uuid = require("uuid");
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const speakeasy = require("speakeasy");

const app = express();
app.use(express.json());
const db = new JsonDB(new Config("database", true, false, "/"));

// root route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to 2 factor Authentication" });
});

// Register user and temp secret creation

app.post("/api/register", (req, res) => {
  const id = uuid.v4();
  try {
    const path = `/user/${id}`;
    const temp_secret = speakeasy.generateSecret();
    db.push(path, { id });
    res.json({ id, secret: temp_secret.base32 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "cannot create record" });
  }
});
// Token Verification

app.post("/api/verify", (req, res) => {
  const { token, userId } = req.body;
  try {
    const path = `/user/${userId}`;
    const user = db.getData(path);
    const { base32: secret } = user.temp_secret;
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });
    if (verified) {
      db.push(path, { id: userId, secret: user.temp_secret });
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("Example app listening on port 5000!");
});
