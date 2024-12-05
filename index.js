const express = require('express');
const connectToDb = require('./DBConnection/Connection')
const app = express();
const cors = require('cors');
const passport = require('passport');
const errorMiddleware = require('./middleware/error.middleware')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
console.log(process.env.JWT_SECRET);
console.log(process.env.JWT_Refresh_SECRET);



const server = http.createServer(app);
// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow requests from any origin (adjust if needed for security)
    methods: ['GET', 'POST'],
  },
});



app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use('/dataset', express.static(path.join(__dirname, 'dataset')));





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


const hospitalRoutes = require('./Routes/hospital.routes.js');
app.use('/api/hospital', hospitalRoutes);


const adminRoutes = require('./Routes/admin.routes');
app.use('/api/admin', adminRoutes);



const uploadRoutes = require('./Routes/uploadRoutes.routes');
app.use('/api/upload', uploadRoutes);

const folderRoutes = require('./Routes/folderRoutes.routes');
app.use('/api/folder', folderRoutes);



// Chat routes require access to Socket.io for real-time updates
const chatRoutes = require('./Routes/chat.routes');
app.use('/api/chat', (req, res, next) => {
  req.io = io; // Make Socket.io instance available in the chat routes
  next();
}, chatRoutes);


// Serve static files from the 'dataset' folder
app.use('/datasets', express.static(path.join(__dirname, 'datasets')));


app.use(errorMiddleware)

app.listen(3000,()=>{
  console.log("listening on port 3000")
  connectToDb()
})  


// Listen for new connections on Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle the disconnection event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

