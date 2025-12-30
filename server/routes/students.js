const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

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

// Get student profile
router.get('/profile', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Access denied' });

  try {
    const student = await Student.findById(req.user.id).populate('attendance');
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student analytics
router.get('/analytics', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Access denied' });

  try {
    const attendances = await Student.findById(req.user.id).populate('attendance');
    const totalClasses = attendances.attendance.length;
    const presentClasses = attendances.attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    res.json({
      totalClasses,
      presentClasses,
      absentClasses: totalClasses - presentClasses,
      attendancePercentage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
