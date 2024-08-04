const express = require('express');
const connectToDb = require('./DBConnection/Connection')
const app = express();
const cors = require('cors');
const passport = require('passport');
const errorMiddleware = require('./middleware/error.middleware')
const dotenv = require('dotenv')

dotenv.config();
console.log(process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());
app.use(passport.initialize());



const V1router = require('./routes/index')

console.log("FUck you choudary ")

app.get("/", (req,res)=>{
  res.status(200).json({
    "message":"success"
  })
})
app.use('/api',V1router)

app.use(errorMiddleware)

app.listen(3000,()=>{
  console.log("listening on port 3000")
  connectToDb()
})