const jwt = require('jsonwebtoken')


module.exports =   generateToken = (_id,role) => {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id: _id , role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}



