const AdminService = require('../services/AdminService');

const AdminController = {
    async verifyCenter(req, res, next) {
        try {
            const { healthCareCenterId } = req.body;
            const center = await AdminService.verifyCenter(healthCareCenterId);
            if (center.error) {
                const error = {
                    status: 401,
                    message: center.message
                }
                return next(error);
            }
            res.status(200).json({
                center
            });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = AdminController;