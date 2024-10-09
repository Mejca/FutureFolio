const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3002;
const url = 'mongodb://localhost:27017';
const dbName = 'FutureFolio';
const client = new MongoClient(url);

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    const db = client.db(dbName);

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    defineRoutes();
    startServer();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

function defineRoutes() {
  app.get('/', (req, res) => {
    res.send('Welcome to the FutureFolio application!');
  });

  app.get('/api/modules', async (req, res) => {
    try {
      const collection = req.db.collection('MechanicalEngineering');
      const modules = await collection.find({}).toArray();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Define other routes here if needed
}

function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something went wrong!');
});

connectDB();
