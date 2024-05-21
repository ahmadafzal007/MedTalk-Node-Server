const express = require('express');
const connectToDb = require('./DBConnection/Connection')
const app = express();


const router = require('./routes/V1/IndexRoutes')

console.log("FUck you choudary ")
app.get('/api',router)

app.listen(3000,()=>{
  console.log("listening on port 3000")
  connectToDb()
})