const Chat = require('../models/Chat');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { IncomingForm } = require('formidable');
const axios = require('axios');
const fs = require('fs');
const cloudinary = require('cloudinary').v2; // Make sure to configure Cloudinary in your project
const FormData = require('form-data');



// // Create new chat window (for user/doctor)
// exports.createChatWindow = async (req, res, next) => {
//   try {
//     const { userId } = req.user; // Assuming user ID is in req.user (from JWT auth)
//     const { doctorId, patientId } = req.body; // doctorId and patientId are optional, patientId is required for patient chat

//     console.log("user id: ", userId)
//     // Find the user and doctor (if provided)
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     let doctor = null;
//     if (doctorId) {
//       doctor = await Doctor.findById(doctorId);
//       if (!doctor) {
//         return res.status(404).json({ message: 'Doctor not found' });
//       }
//     }

//     let chatData = { users: [user._id] };

//     // If doctor is creating the chat
//     if (user.role === 'doctor' && doctor) {
//       chatData.users.push(doctor._id);
//     }

//     // If the chat is for a specific patient
//     if (patientId) {
//       const patient = await Patient.findById(patientId);
//       if (!patient) {
//         return res.status(404).json({ message: 'Patient not found' });
//       }
//       chatData.patient = patient._id;
//     }

//     // Create a new chat window
//     const newChatWindow = new Chat(chatData);
//     await newChatWindow.save();

//     res.status(201).json({
//       message: 'Chat window created successfully',
//       chatWindow: newChatWindow,
//     });
//   } catch (err) {
//     next(err);
//   }
// };




exports.createChatWindow = async (req, res) => {
  try {

    const  userId  = req.user._id; // Assuming user ID is in req.user (from JWT auth)
    const { patientId } = req.body; // doctorId and patientId are optional

    console.log("user id: ", userId);

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let chatData = { users: [user._id] };

    // If doctor is creating the chat
    if (user.role === 'doctor') {
      // Scenario 1: Doctor creates chat without associating a patient
      if (!patientId) {
        chatData.patient = null; // Not associated with any patient
      } 
      // Scenario 2: Doctor creates chat and associates a patient
      else {
        const patient = await Patient.findById(patientId);
        if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        chatData.patient = patient._id; // Associate with patient
      }
    } else {
      // Non-doctor creating the chat, no patient association
      chatData.patient = null; // No patient associated
    }

    // Create a new chat window
    const newChatWindow = new Chat(chatData);
    await newChatWindow.save();

    res.status(201).json({
      message: 'Chat window created successfully',
      chatWindow: newChatWindow,
    });
  } catch (err) {
    next(err);
  }
};





// Get all chat windows for a user/doctor
exports.getUserChats = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming user ID is in req.user (from JWT auth)

    // Find all chat windows involving the current user
    const chats = await Chat.find({ users: userId }).populate('users', 'name email').populate('patient', 'name cnic');

    if (!chats) {
      return res.status(404).json({ message: 'No chat windows found' });
    }

    res.status(200).json({
      message: 'Chat windows retrieved successfully',
      chats,
    });
  } catch (err) {
    next(err);
  }
};










// Function to upload images to Cloudinary
const uploadToCloudinary = async (imagePath) => {
      // Configuration
      cloudinary.config({ 
        cloud_name: 'dj3p3xvrj', 
        api_key: '838199179614134', 
        api_secret: 'FVlxqj5J5wYETH-a-wk6t5BEyDY' // Click 'View API Keys' above to copy your API secret
    });
    
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'chat_images',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};


// // Function to send data to FastAPI server
// const sendToFastApi = async (prompt, imagePath, csvPath, previousMessage = null) => {
//   console.log("Image Path: ", imagePath);
//   try {
//     console.log(imagePath);
//     const formData = new FormData();
//     formData.append('prompt', prompt);

//     if (previousMessage) {
//       formData.append('previous_message', previousMessage);
//     }

//     if (imagePath) {
//       formData.append('file', fs.createReadStream(imagePath));
//     }

//     if (csvPath) {
//       formData.append('file', fs.createReadStream(csvPath));
//     }

//     console.log("Form Data: ",formData);
//     const response = await axios.post('http://127.0.0.1:8000/generate_response', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log(response.data)
//     return response.data;
//   } catch (error) {
//     console.error('Error connecting to FastAPI server:', error);
//     throw error;
//   }
// };



const sendToFastApi = async (prompt, imagePath, csvPath, previousMessage = null) => {
  console.log("Image Path: ", imagePath);
  console.log("CSV Path: ", csvPath);

  try {
    const formData = new FormData();

    // Handle single values for prompt and previous message
    const singlePrompt = Array.isArray(prompt) ? prompt[0] : prompt;
    const singlePreviousMessage = Array.isArray(previousMessage) ? previousMessage[0] : previousMessage;

    formData.append('prompt', singlePrompt);

    if (singlePreviousMessage) {
      formData.append('previous_message', singlePreviousMessage);
    }

    // Append the image file if available
    if (imagePath) {
      formData.append('file', fs.createReadStream(imagePath));
    }

    // Append the CSV file if available
    if (csvPath) {
      formData.append('file', fs.createReadStream(csvPath)); // If you're using the same field name, consider changing it
    }

    // Log FormData for debugging
    console.log("Form Data Entries:");
    formData.getLength((err, length) => {
      if (err) {
        console.error('Error getting FormData length:', err);
        return;
      }
      console.log(`Form Data Length: ${length}`);
    });

    // Send the request to FastAPI
    const response = await axios.post('http://127.0.0.1:8000/generate_response', formData, {
      headers: {
        ...formData.getHeaders(), // This sets the correct headers
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error connecting to FastAPI server:', error);
    throw error;
  }
};

exports.handleChatRequest = async (req, res, next) => {
  console.log("Handling chat request");
  const form = new IncomingForm({ multiples: true, keepExtensions: true }); // Allow file parsing and retain file extensions

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    // Logging the parsed files and fields
    console.log('Parsed fields:', fields); // Logs text fields (like prompt, chatId)
    // console.log('Parsed files:', files);   // Logs file fields (like image, csv)

    const prompt = Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt;
    const { chatId, previousMessage } = fields;
    const image = files.image && files.image.length > 0 ? files.image[0].filepath : null;
    // const csv = files.csv ? files.csv.filepath : null;
    const csv = files.csv && files.csv.length > 0 ? files.csv[0].filepath : null;

    console.log('Image:', image);
    try {
      let imageUrl = null;

      // Upload image to Cloudinary if an image file is provided
      if (image) {
        imageUrl = await uploadToCloudinary(image);  // Upload the image
      }

      console.log('Image URL:', imageUrl);
      // Send request to FastAPI and get the response
      const fastApiResponse = await sendToFastApi(prompt, imageUrl ? image : null, csv, previousMessage);

      // Find the chat by chatId
      const chatWindow = await Chat.findById(chatId);
      if (!chatWindow) {
        return res.status(404).json({ message: 'Chat window not found' });
      }

      // Add the FastAPI response to the chat messages
      const newMessage = {
        prompt,
        response: fastApiResponse.gpt_response,
        result: fastApiResponse.result || null,
        plot_url: fastApiResponse.plot_url || null,
        image_url: imageUrl,  // Store the Cloudinary image URL
      };

      chatWindow.messages.push(newMessage);
      await chatWindow.save();

      // Real-time update to the frontend via Socket.io
      req.io.emit('chatUpdate', {
        chatId: chatWindow._id,
        newMessage,
      });

      res.status(200).json({
        message: 'Chat message updated successfully',
        chatWindow,
      });
    } catch (error) {
      next(error);
    }
  });
};