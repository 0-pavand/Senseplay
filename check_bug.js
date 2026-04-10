const fs = require('fs');
const gamesTs = fs.readFileSync('src/data/games.ts', 'utf-8');
const levelFlow = fs.readFileSync('src/components/LevelFlow.tsx', 'utf-8');
console.log(levelFlow.includes('handleOptionClick('));
