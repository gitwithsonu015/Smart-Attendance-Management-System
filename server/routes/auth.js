const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const router = express.Router();

// Register Student
router.post('/register/student', async (req, res) => {
  console.log('Register student request:', req.body);
  const { name, email, password, rollNumber, class: studentClass } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashedPassword, rollNumber, class: studentClass });
    await student.save();
    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET);
    console.log('Student registered successfully:', student._id);
    res.status(201).json({ message: 'Student registered successfully', token, user: student });
  } catch (err) {
    console.log('Student registration error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Register Faculty
router.post('/register/faculty', async (req, res) => {
  const { name, email, password, department } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new Faculty({ name, email, password: hashedPassword, department });
    await faculty.save();
    const token = jwt.sign({ id: faculty._id, role: 'faculty' }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'Faculty registered successfully', token, user: faculty });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login request:', req.body);
  const { email, password, role } = req.body;
  try {
    let user;
    if (role === 'student') {
      user = await Student.findOne({ email });
    } else {
      user = await Faculty.findOne({ email });
    }
    console.log('User found:', user ? user._id : 'null');
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET);
    console.log('Login successful for user:', user._id);
    res.json({ token, user });
  } catch (err) {
    console.log('Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
