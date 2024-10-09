const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific course
router.get('/:id', getCourse, (req, res) => {
  res.json(res.course);
});

// Create a new course
router.post(
  '/',
  [
    body('courseCode').not().isEmpty().withMessage('Course code is required'),
    body('courseName').not().isEmpty().withMessage('Course name is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = new Course({
      courseCode: req.body.courseCode,
      courseName: req.body.courseName,
      descriptionShort: req.body.descriptionShort,
      descriptionLong: req.body.descriptionLong,
      modules: req.body.modules,
      academicYear: req.body.academicYear,
      offeringSchool: req.body.offeringSchool
    });

    try {
      const newCourse = await course.save();
      res.status(201).json(newCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Update a course
router.put('/:id', getCourse, async (req, res) => {
  if (req.body.courseCode != null) {
    res.course.courseCode = req.body.courseCode;
  }
  if (req.body.courseName != null) {
    res.course.courseName = req.body.courseName;
  }
  if (req.body.descriptionShort != null) {
    res.course.descriptionShort = req.body.descriptionShort;
  }
  // Add other fields similarly...

  try {
    const updatedCourse = await res.course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course
router.delete('/:id', getCourse, async (req, res) => {
  try {
    await res.course.remove();
    res.json({ message: 'Deleted Course' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a course by ID
async function getCourse(req, res, next) {
  let course;
  try {
    course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: 'Cannot find course' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.course = course;
  next();
}

module.exports = router;
