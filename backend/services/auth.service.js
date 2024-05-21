const userModel = require('../models/user.model');
const userService = require('./user.service');
const generateToken = require('../Utils/jwt');
const healthCareProfessionalModel = require('../models/hcProfessional.model');
  const healthCareCenterAdminModel = require('../models/hcCenterAdmin.model');
const scholarModel = require('../models/scholar.model');

const AuthService = {
  async login(email, password, role) {
    const user = await userModel.findOne({ email });
    if (!user) { 
      return {
        error: true,
        message: 'User not found'
      };
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      console.log(user.role, role);
      return {
        error: true,
        message: 'User not found'
      };
    }

    if (user.password !== password) {
      return {
        error: true,
        message: 'Incorrect password'
      };
    }

    const token = generateToken(user._id, user.role);
    return {
      error: false,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        id: user._id
      },
      token
    };
  },

  async signup(email, password, name, role, department, healthCareCenterId) {
    if (await userService.emailExists(email)) {
      return {
        error: true,
        message: 'Email already exists'
      };
    }

    const user = new userModel({
      email,
      passwordHash: password, // Make sure to hash the password in production
      name,
      role
    });

    await user.save();

    if (role.toLowerCase() === 'healthcareprofessional') {
      const healthCareProfessional = new healthCareProfessionalModel({
        user: user._id,
        department,
        healthCareCenterId
      });

      await healthCareProfessional.save();
    } else if (role.toLowerCase() === 'healthcarecenteradmin') {
      const healthCareCenterAdmin = new healthCareCenterAdminModel({
        user: user._id
      });

      await healthCareCenterAdmin.save();
    } else if (role.toLowerCase() === 'scholar') {
      const scholar = new scholarModel({
        user: user._id
      });

      await scholar.save();
    }

    const token = generateToken(user._id, user.role);

    return {
      error: false,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        id: user._id
      },
      token
    };
  }
};

module.exports = AuthService;
