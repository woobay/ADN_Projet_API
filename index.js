const express = require('express')
const routes = require('./src/api/routes/routes')
const cors = require('cors')


app = express()
const corsOption = {
    origin: '*', 
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    credential: true
}

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.PORT || 4000

const MONGODB_URL = process.env.MONGODB_URL

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors(corsOption))
app.use(routes)

mongoose.connect(MONGODB_URL,{ useNewUrlParser: true })
.then(()=>{console.log('you are connected to ...')})
.catch(()=>{console.log("You are not connected")});

app.listen(port, () => {
    console.log(`Our server is running at http://localhost:${port}`)
})