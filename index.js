const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');



// --------------MIDDLEWARE ENDS HERE--------------


app.use(cors());
app.use(express.json());



//---------------MIDDLEWARE ENDS HERE--------------




// ---------------MongoDB Starts here-------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.2iksbit.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run(){
  try{
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }

  finally{
    await client.close();
  }
}
run().catch(console.dir);


// ----------------Mongo DB ends here -----------------------------






app.get('/', (req, res) => {
    res.send('From server...HI')
})


app.listen(port, () => {
    console.log(`Hi I am running on port ${port}`)
})