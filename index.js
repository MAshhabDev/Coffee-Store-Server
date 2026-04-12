const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
// Ekhane ObjectId add kora hoyeche
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-k50mwtj-shard-00-00.4j5c4iq.mongodb.net:27017,ac-k50mwtj-shard-00-01.4j5c4iq.mongodb.net:27017,ac-k50mwtj-shard-00-02.4j5c4iq.mongodb.net:27017/?ssl=true&replicaSet=atlas-xqdkdv-shard-0&authSource=admin&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const coffeesCollection = client.db('coffeeDB').collection('coffees');
    const usersCollection = client.db('coffeeDB').collection('users');


    // 1. Get All Coffees
    app.get('/coffees', async (req, res) => {
      const result = await coffeesCollection.find().toArray();
      res.send(result);
    });

    // 2. Add Coffee (Post)
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    });

    // 3. Delete Coffee (Eti ekhon post er baire)
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Ekhon ObjectId kaj korbe
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    // 3. Update Coffee (Eti ekhon post er baire)
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Ekhon ObjectId kaj korbe
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    });

    app.put('/coffees/:id', async (req, res) => {

      const id = req.params.id;
      const coffee = req.body;

      const filter = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo
        }
      };

      const options = { upsert: false };

      const result = await coffeesCollection.updateOne(filter, updatedDoc, options);

      res.send(result);

    });

    // create user

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // Update user sob user pawart jonno

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    
    // 3. Delete User (Eti ekhon post er baire)
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Ekhon ObjectId kaj korbe
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Update User

    app.patch("/users/", async (req, res) => {
      const email = req.body.email;
      const filter = { email }; 
      
      const updatedDoc={
        $set:{
          lastSignInTime:req.body?.lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter,updatedDoc);
      res.send(result);
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } finally {
    // client.close() bondho thaka thik ache
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee Server Getting hotter");
});

app.listen(port, () => {
  console.log(`Coffee Server Is Running On ${port}`);
});