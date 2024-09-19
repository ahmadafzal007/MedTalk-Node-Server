const express = require('express');
const connectToDb = require('./DBConnection/Connection')
const app = express();
const cors = require('cors');
const passport = require('passport');
const errorMiddleware = require('./middleware/error.middleware')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');




dotenv.config();
console.log(process.env.JWT_SECRET);
console.log(process.env.JWT_Refresh_SECRET);

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(passport.initialize());




app.get("/", (req,res)=>{
  res.status(200).json({
    "message":"success"
  })
})
const authRoutes = require('./Routes/auth.routes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./Routes/user.routes');
app.use('/api/users', userRoutes);


const doctorRoutes = require('./Routes/doctor.routes');
app.use('/api/doctor', doctorRoutes);

app.use(errorMiddleware)

app.listen(3000,()=>{
  console.log("listening on port 3000")
  connectToDb()
})