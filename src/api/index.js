const express = require('express')
const routes = require('./routes/routes')

app = express()

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const port = process.env.PORT || 4000

const DATABASE_LOCAL = process.env.DATABASE_LOCAL

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(routes)

mongoose.connect(DATABASE_LOCAL,{ useNewUrlParser: true })
.then(()=>{console.log('you are connected to ...')})
.catch(()=>{console.log("You are not connected")});

app.listen(port, () => {
    console.log(`Our server is running at http://localhost:${port}`)
})