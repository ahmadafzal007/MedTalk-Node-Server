const userModel = require('../models/user.model');

const UserService = {
    async createUser(name,email,password,role) {
        console.log("Afzal");
        // Check if the email already exists
            const user = await UserService.emailExists(email);

            if (user){
                console.log(user)
                console.log('Email already exists')
            return {
                status: 403,
                message: "User already exists"}
            }
          
        try {
            const user = await userModel.create({ name, email, password, role });
            console.log(" in user service , ",user)
            return user;
        } catch (err) {
            console.error('Error creating user:', err);
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    },

    async updateUser(id, data) {
        try {
            const user = await userModel.findOneAndUpdate({ _id: id }, data, { new: true });
            return user;
        } catch (err) {
            console.error('Error updating user:', err);
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    },

    async emailExists(email) {
        try {
            const user = await userModel.findOne({ email });
            return user;
        } catch (err) {
            console.error('Error checking email existence:', err);
            return false; // or handle differently if critical
        }
    },

    async getInfo(id) {
        try {
            const response = await userModel.findById(id);
            if (response) {
                return {
                    status: 200,
                    data: response,
                };
            } else {
                return {
                    status: 404,
                    message: "User not found",
                };
            }
        } catch (err) {
            console.error('Error fetching user info:', err);
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    }
}

module.exports = UserService;
