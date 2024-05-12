// Import required modules
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'worktree'; // Use the correct database name
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB and start the server
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    const db = client.db(dbName);

    // Middleware to add db to request
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    defineRoutes(); // Setup routes
    startServer(); // Start listening for requests
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

// Define API endpoints
function defineRoutes() {
  app.get('/', (req, res) => {
    res.send('Welcome to the Worktree application!');
  });

  // List all courses
  app.get('/api/courses', async (req, res) => {
    try {
      const result = await req.db.collection('courses').find({}).toArray();
      res.json(result);
    } catch (err) {
      res.status(500).send('Error fetching courses');
    }
  });

  // Get details for a specific course including compulsory modules
  app.get('/api/courses/:courseId', async (req, res) => {
    try {
      const courseId = new ObjectId(req.params.courseId);
      const course = await req.db.collection('courses').findOne({ _id: courseId });
      const modules = await req.db.collection('modules').find({ courseId: courseId, isCompulsory: true }).toArray();
      res.json({ course, compulsoryModules: modules });
    } catch (err) {
      res.status(500).send('Error fetching course details');
    }
  });

  // List all modules
  app.get('/api/modules', async (req, res) => {
    try {
      const result = await req.db.collection('modules').find({}).toArray();
      res.json(result);
    } catch (err) {
      res.status(500).send('Error fetching modules');
    }
  });

  // Get a specific module by ID
  app.get('/api/modules/:id', async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const module = await req.db.collection('modules').findOne({ _id: id });
      res.json(module);
    } catch (err) {
      res.status(500).send(`Error fetching module with ID ${req.params.id}`);
    }
  });
}

// Start the server
function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Properly handle SIGINT for graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
}

// Connect to DB and initialize the app
connectDB();
