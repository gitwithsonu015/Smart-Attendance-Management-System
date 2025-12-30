const express = require('express');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const QRCode = require('qrcode');

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

// Generate QR Code for attendance
router.post('/generate-qr', verifyToken, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Access denied' });

  const { className } = req.body;
  try {
    const qrData = JSON.stringify({ class: className, facultyId: req.user.id, timestamp: Date.now() });
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark attendance via QR scan
router.post('/mark', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Access denied' });

  const { qrData } = req.body;
  try {
    const { class: className, facultyId } = JSON.parse(qrData);
    const attendance = new Attendance({
      student: req.user.id,
      class: className,
      markedBy: facultyId
    });
    await attendance.save();

    // Add to student's attendance
    await Student.findByIdAndUpdate(req.user.id, { $push: { attendance: attendance._id } });

    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance records for faculty
router.get('/records', verifyToken, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Access denied' });

  try {
    const records = await Attendance.find({ markedBy: req.user.id }).populate('student');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate report
router.get('/report', verifyToken, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ error: 'Access denied' });

  try {
    const records = await Attendance.find({ markedBy: req.user.id }).populate('student');
    // Simple report generation (can be enhanced)
    const report = records.reduce((acc, record) => {
      const studentId = record.student._id.toString();
      if (!acc[studentId]) {
        acc[studentId] = { name: record.student.name, present: 0, total: 0 };
      }
      acc[studentId].total++;
      if (record.status === 'present') acc[studentId].present++;
      return acc;
    }, {});

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
