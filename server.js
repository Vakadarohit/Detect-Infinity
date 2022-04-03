const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express(),
  bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());

app.get("/getDetails", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  uploadSecurityCheck(req.query.a, req.query.b, req.query.c);
  res.end();
});

app.get("/fetchDetails", async (req, res) => {
  console.log("Inside Fetch Details");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const url =
    "mongodb+srv://detect_infinity:thunderbolts@cluster0.osjc5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const dbName = "vehicle";
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected correctly to server: Inspection Check");
    const db = client.db(dbName);
    const col = db.collection("inspectionCheck");
    returnObject = await col.find().toArray(async function (err, result) {
      if (err) throw err;
      await client.close();
      console.log("Data fetched: Inspection");
      //console.log(result);
      res.json(result);
    });
  } catch (err) {
    console.log(err.stack);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

async function uploadSecurityCheck(a, b, c) {
  const url =
    "mongodb+srv://detect_infinity:thunderbolts@cluster0.osjc5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const dbName = "vehicle";
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected correctly to server: Security Check");
    const db = client.db(dbName);
    const col = db.collection("securityCheck");
    var number_plate = a;
    var weight = b;
    var departed = c;
    let personDocument = {
      truck_number_plate: number_plate,
      weight: weight,
      departed: departed,
    };
    const p = await col.insertOne(personDocument);
    console.log("Data updated: Security Check");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
