const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

module.exports = {
  sendErrorResponse,
};
