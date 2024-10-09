const { MongoClient } = require('mongodb');

async function insertModules() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const modules = [
    {
      "moduleCode": "MMME1032",
      "moduleName": "Aircraft Design and Performance",
      "descriptionShort": "Study of aircraft design and performance principles.",
      "descriptionLong": "This module covers the principles of aircraft design and performance, including aerodynamics, propulsion, and flight mechanics.",
      "summaryOfContents": "Principles of aircraft design and performance, aerodynamics, propulsion, flight mechanics.",
      "credits": 10,
      "taught": "Full Year UK",
      "convenor": "Dr. James Brown",
      "prerequisites": [],
      "targetStudents": "Primarily for 1st year UG students in Aerospace Engineering.",
      "academicYear": 2024,
      "offeringSchool": "Mechanical, Materials & Manufacturing Engineering",
      "reAssessment": "Students who fail this module overall and are required to complete a re-assessment will be re-assessed by coursework.",
      "educationalAims": "To provide students with knowledge and skills in aircraft design and performance.",
      "assessment": [
        {
          "type": "Coursework",
          "weight": 100,
          "duration": null,
          "requirements": "Coursework - 100%: LO1, LO2"
        }
      ],
      "assessmentPeriod": "Assessed by end of full year",
      "learningOutcomes": [
        "LO1 - Understand the principles of aircraft design and performance.",
        "LO2 - Apply aerodynamics, propulsion, and flight mechanics knowledge to aerospace projects."
      ]
    },
    {
      "moduleCode": "MMME4066",
      "moduleName": "Advanced Powertrain Engineering",
      "descriptionShort": "Study of advanced powertrain engineering principles.",
      "descriptionLong": "This module covers the principles of advanced powertrain engineering, including engine design, hybrid systems, and alternative fuels.",
      "summaryOfContents": "Principles of advanced powertrain engineering, engine design, hybrid systems, alternative fuels.",
      "credits": 10,
      "taught": "Autumn UK",
      "convenor": "Dr. Thomas Green",
      "prerequisites": [],
      "targetStudents": "Primarily for 4th year UG students in Mechanical Engineering.",
      "academicYear": 2024,
      "offeringSchool": "Mechanical, Materials & Manufacturing Engineering",
      "reAssessment": "Students who fail this module overall and are required to complete a re-assessment will be re-assessed by coursework.",
      "educationalAims": "To provide students with advanced knowledge and skills in powertrain engineering.",
      "assessment": [
        {
          "type": "Coursework",
          "weight": 100,
          "duration": null,
          "requirements": "Coursework - 100%: LO1, LO2"
        }
      ],
      "assessmentPeriod": "Assessed by end of autumn semester",
      "learningOutcomes": [
        "LO1 - Understand the principles of advanced powertrain engineering.",
        "LO2 - Apply engine design, hybrid systems, and alternative fuels knowledge to engineering projects."
      ]
    },
    {
      "moduleCode": "MMME1049",
      "moduleName": "Aerospace Design and Materials",
      "descriptionShort": "Study of aerospace design and materials principles.",
      "descriptionLong": "This module covers the principles of aerospace design and materials, including structural design, material properties, and applications.",
      "summaryOfContents": "Principles of aerospace design and materials, structural design, material properties, applications.",
      "credits": 10,
      "taught": "Full Year UK",
      "convenor": "Dr. Michael White",
      "prerequisites": [],
      "targetStudents": "Primarily for 1st year UG students in Aerospace Engineering.",
      "academicYear": 2024,
      "offeringSchool": "Mechanical, Materials & Manufacturing Engineering",
      "reAssessment": "Students who fail this module overall and are required to complete a re-assessment will be re-assessed by coursework.",
      "educationalAims": "To provide students with knowledge and skills in aerospace design and materials.",
      "assessment": [
        {
          "type": "Coursework",
          "weight": 100,
          "duration": null,
          "requirements": "Coursework - 100%: LO1, LO2"
        }
      ],
      "assessmentPeriod": "Assessed by end of full year",
      "learningOutcomes": [
        "LO1 - Understand the principles of aerospace design and materials.",
        "LO2 - Apply structural design, material properties, and applications knowledge to aerospace projects."
      ]
    }
  ];

  try {
    await client.connect();
    const database = client.db("FutureFolio");
    const collection = database.collection("MechanicalEngineering");

    const result = await collection.insertMany(modules);
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}

insertModules().catch(console.error);
