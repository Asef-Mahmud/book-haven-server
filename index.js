const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



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

    // COLLECTIONs
    const db = client.db('book_haven_db')
    const booksCollection = db.collection('books')
    const commentsCollection = db.collection('comments')



    // BOOKS COLLECTION
    
    //Get 
    // 1. GetALLBooks
    app.get('/all-books', async(req, res) => {
      const order = req.query.order === 'asc' ? 1 : -1; 
      const cursor = booksCollection.find().sort({ rating: order, created_at: -1 })

      const result = await cursor.toArray()
      res.send(result)
    })



    //Get latest books
    app.get('/books/latest-books', async (req, res) => {
      const cursor = booksCollection.find().sort({created_at: -1}).limit(6)
      const result = await cursor.toArray()
      res.send(result)
    })


    // Get My Books
    app.get('/my-books', async(req, res) => {
      const email = req.query.email
      const query = {}
      if(email){
        query.userEmail = email
      }

      const cursor = booksCollection.find(query).sort({created_at: -1})
      const result = await cursor.toArray()
      res.send(result)
    })



    // 2. GetOne
    app.get('/book-details/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await booksCollection.findOne(query)
      res.send(result)
    })



    // Post
    app.post('/add-book', async(req, res) => {
        const newBook = req.body;

        // Verify the book hasn't been added before
        const verifyBook = await booksCollection.findOne({title: newBook.title, author: newBook.author})
        if(verifyBook){
          return res.status(400).send({message: "This book already exists! Try Another!"})
        }

        newBook.created_at = new Date();
        const result = await booksCollection.insertOne(newBook)
        res.send(result)
    })

    
    // Patch
    app.patch('/update-book/:id', async(req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const query = {_id: new ObjectId(id)}

      const update = {
        $set: {
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          rating: updatedBook.rating,
          summary: updatedBook.summary,
          coverImage: updatedBook.coverImage,

        } 
      }

      const result = await booksCollection.updateOne(query, update)
      res.send(result)
    })

    // Delete
    app.delete('/delete-book/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await booksCollection.deleteOne(query)
      res.send(result)
    })



    // Comments Collection

    app.post('/comments', async(req, res) => {
      const newComments = req.body;
      newComments.created_at = new Date();

      const result = await commentsCollection.insertOne(newComments)
      res.send(result)
    })



    app.get('/comments', async(req, res) => {

    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }

  finally{
    // await client.close();
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