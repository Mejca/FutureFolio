const fs = require('fs');
const path = require('path');

function generateDirectoryStructure(dirPath, depth = 0, maxDepth = 3) {
  let structure = '';
  const prefix = ' '.repeat(depth * 2);

  if (depth > maxDepth) return structure;

  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      structure += `${prefix}${file}/\n`;
      structure += generateDirectoryStructure(filePath, depth + 1, maxDepth);
    } else {
      structure += `${prefix}${file}\n`;
    }
  });

  return structure;
}

const rootDir = path.resolve(__dirname);
const directoryStructure = generateDirectoryStructure(rootDir);

fs.writeFileSync('directoryStructure.txt', directoryStructure);
console.log('Directory structure has been written to directoryStructure.txt');
