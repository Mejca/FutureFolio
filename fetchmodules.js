const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://localhost:27017"; // Use the basic connection string for local MongoDB
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db('FutureFolio');
        console.log(`Using database: ${database.databaseName}`);

        const modules = database.collection('MechanicalEngineering');
        console.log(`Using collection: ${modules.collectionName}`);

        const modulesCursor = modules.find({}, { projection: { moduleName: 1, moduleCode: 1 } });
        const modulesList = await modulesCursor.toArray();

        console.log(`Total modules in the database: ${modulesList.length}`);
        modulesList.forEach((module, index) => {
            if (module.moduleName) {
                console.log(`${index + 1}. ${module.moduleName}`);
            } else {
                console.log(`${index + 1}. Module name not found (moduleCode: ${module.moduleCode || "N/A"}) - Full document:`, module);
            }
        });
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
