const userModel = require("../models/user.model");
const userService = require("./user.service");
const generateToken = require("../Utils/jwt");
const hcProfessional = require("../services/hcProfessional.service");
const healthCareCenterAdminModel = require("../models/hcCenter.model");

const AuthService = {
  async login(email, password, role) {
    const user = await userModel.findOne({ email });
    if (!user || user.role.toLowerCase() !== role.toLowerCase()) {
      return { error: true, message: "User not found or role mismatch" };
    }

    if (user.password !== password) {
      return { error: true, message: "Incorrect password" };
    }

    const token = generateToken(user._id, user.role);
    return {
      error: false,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id,
      },
      token,
    };
  },

  async signup(role, req) {
    console.log(req);
    const {
      name,
      email,
      password,
      department,
      healthCareCenterId,
      hospitalName,
      address,
      contactNumber,
    } = req;
    try {
      if (role === "healthcareProfessional") {
        if (!department || !healthCareCenterId || !hospitalName) {
          return {
            error: true,
            message:
              "Department, Health Care Center ID, or Hospital Name missing",
            status: 400,
          };
        }

        const user = await userService.createUser(name, email, password, role);
        if (user.status) {
          return {
            error: true,
            user
          };
        }

        const professional = await hcProfessional.createHealthCareProfessional(
          user._id,
          healthCareCenterId,
          department,
          hospitalName
        );
        return {
          error: false,
          user: {
            id: user._id,
            professionalId: professional._id,
            name: user.name,
            email: user.email,
          },
        };
      } else if (role === "scholar") {
        const user = await userService.createUser(name, email, password, role);
        return { error: false, user };
      } else if (role === "hospitalAdmin") {
        console.log("Ahmad");
        if (!address || !contactNumber || !hospitalName) {
          return {
            error: true,
            message: "Address, Contact Number, or Hospital Name missing",
            status: 400,
          };
        }
        const user = await userService.createUser(name, email, password, role);
        console.log("User created");
        const admin = await healthCareCenterAdminModel.create({
          user: user._id,
          hospitalName,
          address,
          contactNumber,
        });
        console.log(admin);
        const token = generateToken(user._id, user.role);

        return { error: false, "user":admin , token};
      }
    } catch (err) {
      console.error("Error in AuthService:", err);
      return { error: true, message: "Internal server error", status: 500 };
    }
  },
};

module.exports = AuthService;
