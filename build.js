const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const eventsDir = path.join(__dirname, 'src/events');
const dataDir = path.join(__dirname, '_data');
const outputFile = path.join(dataDir, 'events.json');

// Ensure the _data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const getEvents = () => {
  const files = fs.readdirSync(eventsDir);
  const events = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(path.join(eventsDir, filename), 'utf-8');
    const { data: frontmatter, content } = matter(markdownWithMeta);
    return {
      ...frontmatter,
      body: content
    };
  });
  return events;
};

const eventsData = getEvents();
fs.writeFileSync(outputFile, JSON.stringify(eventsData, null, 2));

console.log('Successfully built events.json!');
