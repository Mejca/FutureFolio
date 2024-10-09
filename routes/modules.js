const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

// Get all modules
router.get('/', async (req, res) => {
  try {
    const modules = await req.db.collection('modules').find().toArray();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific module
router.get('/:id', async (req, res) => {
  try {
    const module = await req.db.collection('modules').findOne({ _id: new ObjectId(req.params.id) });
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
