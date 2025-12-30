const express = require('express');
const jwt = require('jsonwebtoken');
const Faculty = require('../models/Faculty');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Get faculty profile
router.get('/profile', verifyToken, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Access denied' });

  try {
    const faculty = await Faculty.findById(req.user.id);
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students (for faculty management)
router.get('/students', verifyToken, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Access denied' });

  try {
    const students = await Faculty.findById(req.user.id).populate('students');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
