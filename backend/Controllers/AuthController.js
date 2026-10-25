const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username, createdAt } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      path: "/",
    });
    return res
      .status(201)
      .json({
        message: "User signed up successfully",
        success: true,
        user: {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not create account. Check the database connection and try again.",
    });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       maxAge: 3 * 24 * 60 * 60 * 1000,
       httpOnly: false,
       path: "/",
     });
     return res.status(201).json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
}

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "No token found",
    });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Invalid token",
      });
    }

    req.userId = data.id;

    next();
  });
};

module.exports.Profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.json({
      status: true,
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Could not load the user profile.",
    });
  }
};

module.exports.Logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: false,
    path: "/",
  });

  res.json({
    status: true,
    message: "User logged out successfully",
  });
};