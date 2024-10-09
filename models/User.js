const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  id: String,
  text: String,
  x: Number,
  y: Number,
  time: Date,
  color: String
});

const LinkSchema = new mongoose.Schema({
  source: String,
  target: String
});

const MindMapSchema = new mongoose.Schema({
  title: String,
  nodes: [NodeSchema],
  links: [LinkSchema]
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  mindMaps: [MindMapSchema]
});

module.exports = mongoose.model('User', UserSchema);
