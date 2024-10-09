const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  descriptionShort: { type: String },
  descriptionLong: { type: String },
  modules: { type: [mongoose.Schema.Types.ObjectId], ref: 'Module' },
  academicYear: { type: Number, required: true },
  offeringSchool: { type: String }
});

module.exports = mongoose.model('Course', courseSchema);
