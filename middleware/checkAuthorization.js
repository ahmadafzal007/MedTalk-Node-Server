// middleware/checkAuthorization.js
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');

const checkAuthorization = async (req, res, next) => {
    try {
        const user = req.user; // The user is set by Passport
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (!doctor || !doctor.authorizationStatus) {
                return res.status(403).json({ message: 'Doctor not authorized' });
            }
        } else if (user.role === 'hospital') {
            const hospital = await Hospital.findOne({ user: user._id });
            if (!hospital || !hospital.authorizationStatus) {
                return res.status(403).json({ message: 'Hospital not authorized' });
            }
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = checkAuthorization;
