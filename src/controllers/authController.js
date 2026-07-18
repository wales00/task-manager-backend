const User = require('../models/User');                    // User model
const jwt = require('jsonwebtoken');  

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields required' });
    }
    
    // CHECK IF USER ALREADY EXISTS
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    
    res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, email: user.email, name: user.name },
      token
    });
    
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    
    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, name: user.name },
      token
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { signup, login };