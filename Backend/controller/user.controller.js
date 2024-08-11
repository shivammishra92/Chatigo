import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";


//signup controller
export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  //console.log("reached user cont")
  try{
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "User already registered" });
      }

      // Hashing the password
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await new User({
        fullname,
        email,
        password: hashPassword,
      });
      await newUser.save();

      if (newUser) {
        //create the newuser and pass its _id to generate token using createTokenAndSaveCookie function
        createTokenAndSaveCookie(newUser._id, res);
        res.status(201).json({
          message: "User created successfully",
          user: {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
          },
        });
      }
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



//login controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });//from our database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ error: "Invalid user credentials" });
    }
    createTokenAndSaveCookie(user._id, res);
    res.status(201).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");//clear the token named "jwt"
    res.status(201).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//fetching all users from the database except the logged in user
export const allUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUser }}).select("-password");//except the logged in user
    res.status(201).json(filteredUsers);
  }
  catch (error) {
    console.log("Error in allUsers Controller: " + error);
  }
};
