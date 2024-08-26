const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //token will look like this
      //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //decoded token id

      req.user = await User.findById(decoded.id).select("-password");
      //it find the user in the database and return the user without password

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
