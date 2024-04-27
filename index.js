const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// all config
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// all middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2brfitt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const saTourismSpotCollection = client
      .db('saTourismDB')
      .collection('places');
    const saTourismCountryCollection = client
      .db('saTourismDB')
      .collection('countries');

    app.get('/allTourCountries', async (req, res) => {
      const cursor = saTourismCountryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/addTouristsSpot', async (req, res) => {
      const newPlace = req.body;
      const result = await saTourismSpotCollection.insertOne(newPlace);
      res.send(result);
    });

    app.get('/allTouristsSpot', async (req, res) => {
      const cursor = saTourismSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/allTouristsSpot/:id', async (req, res) => {
      const Id = req.params.id;
      const query = { _id: new ObjectId(Id) };
      const result = await saTourismSpotCollection.findOne(query);
      res.send(result);
    });
    app.get('/getSpotsByCountry/:country', async (req, res) => {
      const country = req.params.country;
      const query = { country_Name: country };
      const result = await saTourismSpotCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/getMine/:email', async (req, res) => {
      const Email = req.params.email;
      const query = { user_email: Email };
      const result = await saTourismSpotCollection.find(query).toArray();
      res.send(result);
    });

    app.patch('/updateSpot/:id', async (req, res) => {
      const Id = req.params.id;
      const query = { _id: new ObjectId(Id) };
      const info = req.body;
      const updateData = {
        $set: {
          image: info.image,
          tourists_spot_name: info.tourists_spot_name,
          country_Name: info.country_Name,
          location: info.location,
          short_description: info.short_description,
          average_cost: info.average_cost,
          seasonality: info.seasonality,
          travel_time: info.travel_time,
          totalVisitorsPerYear: info.totalVisitorsPerYear,
        },
      };
      const result = await saTourismSpotCollection.updateOne(query, updateData);
      res.send(result);
    });

    app.delete('/deleteSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await saTourismSpotCollection.deleteOne(query);
      res.send(result);
    });

    // ----------------------------------------------------------------

    // app.put('/place/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedPlace = req.body;

    //   const place = {
    //     $set: {
    //       name: updatedPlace.name,
    //       quantity: updatedPlace.quantity,
    //       supplier: updatedPlace.supplier,
    //       taste: updatedPlace.taste,
    //       category: updatedPlace.category,
    //       details: updatedPlace.details,
    //       photo: updatedPlace.photo,
    //     },
    //   };

    //   const result = await saTourismSpotCollection.updateOne(
    //     filter,
    //     place,
    //     options
    //   );
    //   res.send(result);
    // });

    // app.delete('/place/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await saTourismSpotCollection.deleteOne(query);
    //   res.send(result);
    // });

    // // user related apis
    // app.get('/user', async (req, res) => {
    //   const cursor = userCollection.find();
    //   const users = await cursor.toArray();
    //   res.send(users);
    // });

    // app.post('/user', async (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

    // app.patch('/user', async (req, res) => {
    //   const user = req.body;
    //   const filter = { email: user.email };
    //   const updateDoc = {
    //     $set: {
    //       lastLoggedAt: user.lastLoggedAt,
    //     },
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // });

    // app.delete('/user/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await userCollection.deleteOne(query);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('SH_TOURISM server is running');
});

app.listen(port, () => {
  console.log(`SH_TOURISM server is running on port: ${port}`);
});
