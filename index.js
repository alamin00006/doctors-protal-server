const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(express.json())
app.use(cors())

app.get('/', (req, res) =>{
    res.send('doctor ankel tik ase')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ocdik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db("doctorsPortal").collection("services");
        const bookingCollection = client.db("doctorsPortal").collection("booking");

        app.get('/service' , async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services);
        })
        app.post('/booking', async(req, res) =>{
            const booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
            const exist = await bookingCollection.findOne(query);
            if(exist){
                return res.send({success:false, booking: exist})
            }
            const result = await bookingCollection.insertOne(booking)
           return res.send({ success: true ,result})
        })



    }
    finally{

    }
}
run().catch(console.dir)





app.listen(port, () =>{
    console.log(`hello doctor ankel ${port}`)
})