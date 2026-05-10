const fs = require('fs');
const path = require('path');

const filePath = '/Users/campushorizon/Documents/Sharufa.com/Telegram Desktop/ChatExport_2026-04-02/result.json';

console.log('🛠 Starting Advanced JSON Fix...');

let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix missing commas between objects: } { -> } , {
console.log('- Fixing missing commas between objects...');
content = content.replace(/}\s*{/g, '},{');

// 2. Fix missing commas between array elements if they are not objects (unlikely but safe)
// content = content.replace(/]\s*\[/g, '],['); 

// 3. Ensure the file ends with ] then } (closing messages array and root object)
console.log('- Repairing truncated end of file...');
content = content.trim();

// Count brackets to see if we need to close
let openBraces = (content.match(/{/g) || []).length;
let closeBraces = (content.match(/}/g) || []).length;
let openBrackets = (content.match(/\[/g) || []).length;
let closeBrackets = (content.match(/]/g) || []).length;

console.log(`  Braces: { ${openBraces}, } ${closeBraces}`);
console.log(`  Brackets: [ ${openBrackets}, ] ${closeBrackets}`);

while (openBrackets > closeBrackets) {
    content += ']';
    closeBrackets++;
}
while (openBraces > closeBraces) {
    content += '}';
    closeBraces++;
}

fs.writeFileSync(filePath, content);
console.log('✅ JSON Repair Complete!');
