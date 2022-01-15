const logout = (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({success: "logged out successfully"});
}

module.exports = logout;