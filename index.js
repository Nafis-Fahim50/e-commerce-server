const express = require('express');
const app = express()
const cors = require('cors')
require ('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6llxg7j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);


app.get('/', (req,res) =>{
    res.send('REPLIQ E-commerce Server is Running...')
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})