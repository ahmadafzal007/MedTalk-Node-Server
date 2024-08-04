const error = (err, req, res, next) => {
  res.status(500).json({
    message: "An error occurred",
    error: err.message
  });
};

module.exports = error;
