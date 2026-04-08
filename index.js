const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors());

app.use(express.json());

// k2p669inr9gzwtAp
// zI2qM2htNLapc1Ul
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4j5c4iq.mongodb.net/?appName=Cluster0`;
// const uri = "mongodb://CoffeeShop:zI2qM2htNLapc1Ul@ac-k50mwtj-shard-00-00.4j5c4iq.mongodb.net:27017,ac-k50mwtj-shard-00-01.4j5c4iq.mongodb.net:27017,ac-k50mwtj-shard-00-02.4j5c4iq.mongodb.net:27017/?ssl=true&replicaSet=atlas-xqdkdv-shard-0&authSource=admin&appName=Cluster0";

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-k50mwtj-shard-00-00.4j5c4iq.mongodb.net:27017,ac-k50mwtj-shard-00-01.4j5c4iq.mongodb.net:27017,ac-k50mwtj-shard-00-02.4j5c4iq.mongodb.net:27017/?ssl=true&replicaSet=atlas-xqdkdv-shard-0&authSource=admin&appName=Cluster0`;

console.log("USER length:", process.env.DB_USER.length);
console.log("PASS length:", process.env.DB_PASS.length);

console.log("manual PASS length:", "h41l86qIjSdzkaHu".length);


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeesCollection=client.db('coffeeDB').collection('coffees');

    app.get('/coffees',async(req,res)=>{

      const result=await coffeesCollection.find().toArray();
      res.send(result);

    })

    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result=await coffeesCollection.insertOne(newCoffee)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASS);
console.log("URI:", uri);

app.get("/", (req, res) => {
  res.send("Coffee Server Getting hotter")

})

app.listen(port, () => {
  console.log(`Coffee Server Is Running On ${port}`)
})