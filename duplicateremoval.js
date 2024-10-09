const { MongoClient } = require('mongodb');

async function removeDuplicates() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("FutureFolio");
    const collection = database.collection("MechanicalEngineering");

    const modules = await collection.find({}).toArray();
    const uniqueModules = new Map();

    modules.forEach(module => {
      if (!uniqueModules.has(module.moduleCode)) {
        uniqueModules.set(module.moduleCode, module);
      } else {
        // Check if any existing module with the same code has different information
        const existingModule = uniqueModules.get(module.moduleCode);
        if (JSON.stringify(existingModule) !== JSON.stringify(module)) {
          console.log(`Conflicting modules found for code: ${module.moduleCode}`);
        }
      }
    });

    // Remove all duplicates
    await collection.deleteMany({});
    // Insert only unique modules
    await collection.insertMany(Array.from(uniqueModules.values()));
    console.log(`Total unique modules in the database: ${uniqueModules.size}`);
    uniqueModules.forEach((module, index) => {
      console.log(`${index + 1}. ${module.moduleName}`);
    });
  } finally {
    await client.close();
  }
}

removeDuplicates().catch(console.error);
