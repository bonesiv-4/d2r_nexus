const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// This is where all the generated JSON files will go
const dataDir = path.join(__dirname, 'src/_data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const buildCollection = (name) => {
  const sourceDir = path.join(__dirname, 'src', name);
  const outputFile = path.join(dataDir, `${name}.json`);

  if (!fs.existsSync(sourceDir)) {
    console.log(`Directory ${name} not found, creating empty file.`);
    fs.writeFileSync(outputFile, JSON.stringify([]));
    return;
  }

  const files = fs.readdirSync(sourceDir);
  const data = files
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const markdownWithMeta = fs.readFileSync(path.join(sourceDir, filename), 'utf-8');
      const { data: frontmatter, content } = matter(markdownWithMeta);
      return { ...frontmatter, body: content };
    });

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`Successfully built src/_data/${name}.json with ${data.length} items.`);
};

// Process both folders
buildCollection('events');
buildCollection('news');
