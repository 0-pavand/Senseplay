const fs = require('fs');
const content = fs.readFileSync('./src/data/games.ts', 'utf8');

const strings = new Set();
// match single and double quotes
const regex = /(?:title|introText|funFact|guidedText|practiceText|questionText|label):\s*(["'])(.*?)\1/g;
let match;
while ((match = regex.exec(content)) !== null) {
  strings.add(match[2]);
}

console.log('Unique strings:', strings.size);
fs.writeFileSync('strings.json', JSON.stringify(Array.from(strings), null, 2));
