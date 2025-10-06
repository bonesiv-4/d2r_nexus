// This script runs on Netlify's servers every time you publish a change.
// Its job is to find all your individual event and news files
// and combine them into single, easy-to-read JSON files for the website.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

console.log("Starting build process...");

// Function to process a collection (like events or news)
function buildCollection(collectionName) {
  const sourceDir = path.join(__dirname, 'src', collectionName);
  const outputDir = path.join(__dirname, 'src', '_data'); // All JSON files will go here
  const outputFile = path.join(outputDir, `${collectionName}.json`);

  // Check if the source directory (e.g., /src/events) exists
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory ${sourceDir} not found. Skipping collection '${collectionName}'.`);
    // Create an empty JSON file so the website doesn't break
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputFile, '[]');
    return;
  }

  const files = fs.readdirSync(sourceDir);
  const collectionData = [];

  files.forEach(file => {
    // Make sure we're only reading markdown files
    if (path.extname(file) === '.md') {
      const filePath = path.join(sourceDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      collectionData.push({
        ...data,
        body: content
      });
    }
  });

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the combined data to the JSON file
  fs.writeFileSync(outputFile, JSON.stringify(collectionData, null, 2));
  console.log(`Successfully built ${collectionName}.json with ${collectionData.length} items.`);
}

// --- Main Execution ---

// Process the 'events' collection
buildCollection('events');

// Process the 'news' collection
buildCollection('news');

console.log("Build process completed successfully!");

