const express = require('express');
const { createChatWindow, getUserChats, handleChatRequest, getChatWindowById, getChatsWithoutPatient, getChatsWithPatient } = require('../Controllers/chat.controller');
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


router.post(
  '/my-chat',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization, // Ensure that user/doctor is authorized
  getChatWindowById
)

router.get(
  '/chat-without-patient',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization, // Ensure that user/doctor is authorized
  getChatsWithoutPatient
)


router.get(
  '/chat-with-patient',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization, // Ensure that user/doctor is authorized
  getChatsWithPatient
)


// Route to handle chat request, forward to FastAPI, and store response in DB
router.post(
  '/generate-response',
  passport.authenticate('jwt', { session: false }),
  checkAuthorization, // Ensure that user/doctor is authorized
  handleChatRequest
);



module.exports = router;


