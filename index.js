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

async function run(){
    try{
        const productCollection = client.db('e-commerce').collection('products');

        app.get('/products', async(req,res) =>{
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally{

    }
}
run().catch(err=>console.error(err));


app.get('/', (req,res) =>{
    res.send('REPLIQ E-commerce Server is Running...')
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})