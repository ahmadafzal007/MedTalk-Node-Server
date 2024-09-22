const express = require('express');
const { createChatWindow, getUserChats, handleChatRequest } = require('../Controllers/chat.controller');
const passport = require('passport');
const checkAuthorization = require('../middleware/checkAuthorization');

const router = express.Router();

// Route to create a new chat window (for both user and doctor)
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization, // Ensure that user/doctor is authorized
  createChatWindow
);



// Route to get all chat windows for a user or doctor
router.get(
  '/my-chats',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization, // Ensure that user/doctor is authorized
  getUserChats
);


// Route to handle chat request, forward to FastAPI, and store response in DB
router.post(
  '/generate-response',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization, // Ensure that user/doctor is authorized
  handleChatRequest
);



module.exports = router;


