const userModel = require('../models/user.model');
const userService = require('./user.service');
const generateToken = require('../Utils/jwt');
const healthCareProfessionalModel = require('../models/hcProfessional.model');
  const healthCareCenterAdminModel = require('../models/hcCenterAdmin.model');
const scholarModel = require('../models/scholar.model');

const healthCareProfessional = require('../services/hcProfessional.service');

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
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id
      },
      token
    };
  },

  // 'healthcareProfessional', 'admin','scholar'

  async signup(role,req) {
    const {name,email,password} = req;

    let error= {
      "message":'',
      status:0
    };

      if (role === 'healthcareProfessional'){
        const {department , healthCareCenterId} = req;
        if (!department  || !healthCareCenterId){
          error.message = "Department or Id missing";
          error.status = 401
          return error
        }

        const user = await userService.createUser(name,email,password,role);
        const professional = await healthCareProfessional.createHealthCareProfessional(
          user._id , healthCareCenterId , department
        );
        return professional
        
      }else if (role === "scholar"){
          const user = await userService.createUser(email,password,name,role);
          return user;
      }else if (role === "hospitalAdmin"){
          const {address,contactNumber} = req;
          if (!address || !contactNumber){
            error.message = "Address or contact number missing";
            error.status = 401
            return error
          }
          const user = await userService.createUser(email,password,name,role);
          const admin = await healthCareCenterAdminModel.create({
            user:user._id,
            address,
            contactNumber
          });

          return admin;
      }
  }
};

module.exports = AuthService;
