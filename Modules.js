const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  moduleCode: { type: String, required: true },
  moduleName: { type: String, required: true },
  descriptionShort: { type: String },
  descriptionLong: { type: String },
  summaryOfContents: { type: String },
  credits: { type: Number, required: true },
  taught: { type: String },
  convenor: { type: String },
  prerequisites: { type: [String] },
  targetStudents: { type: String },
  academicYear: { type: Number, required: true },
  offeringSchool: { type: String },
  reAssessment: { type: String },
  educationalAims: { type: String },
  assessment: { type: [Object] },
  assessmentPeriod: { type: String },
  learningOutcomes: { type: [String] }
});

module.exports = mongoose.model('Module', moduleSchema);
    