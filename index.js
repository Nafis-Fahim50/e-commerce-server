const express = require('express');
const app = express()
const cors = require('cors')
require ('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

function verifyJWT (req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6llxg7j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const productCollection = client.db('e-commerce').collection('products');
        const orderCollection = client.db('e-commerce').collection('orders');

        app.post('/jwt', (req, res) =>{
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {expiresIn:'1d'});
            res.send({token});

        })

        app.get('/products', async(req,res) =>{
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async(req,res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result);
        })

        app.get('/orders', verifyJWT, async(req, res) =>{

            const decoded = req.decoded
            // console.log(decoded);

            if(decoded.email !== req.query.email){
                res.status('403').send({message: 'unthorized access'})
            }

            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
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