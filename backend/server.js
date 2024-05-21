const express = require('express');
const connectToDb = require('./DBConnection/Connection')
const app = express();


const V1router = require('./routes/index')

console.log("FUck you choudary ")
app.get('/api',V1router)

app.listen(3000,()=>{
  console.log("listening on port 3000")
  connectToDb()
})