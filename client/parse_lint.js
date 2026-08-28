const fs = require('fs');

function parseLint() {
  const buffer = fs.readFileSync('lint.json');
  let content;
  
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    content = buffer.toString('utf16le');
  } else if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    content = buffer.toString('utf16be');
  } else {
    content = buffer.toString('utf8');
  }

  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  try {
    const data = JSON.parse(content);
    const errs = data.filter(d => d.errorCount > 0);
    errs.forEach(e => {
      console.log(e.filePath);
      e.messages.forEach(m => console.log(`  ${m.line}:${m.column}  ${m.severity === 2 ? 'error' : 'warning'}  ${m.message}  ${m.ruleId}`));
    });
  } catch (err) {
    try {
      let contentAlt = buffer.toString('utf16le');
      if (contentAlt.charCodeAt(0) === 0xFEFF) contentAlt = contentAlt.slice(1);
      const data = JSON.parse(contentAlt);
      const errs = data.filter(d => d.errorCount > 0);
      errs.forEach(e => {
        console.log(e.filePath);
        e.messages.forEach(m => console.log(`  ${m.line}:${m.column}  ${m.severity === 2 ? 'error' : 'warning'}  ${m.message}  ${m.ruleId}`));
      });
    } catch (err2) {
      console.error("Failed to parse JSON with both UTF-8 and UTF-16LE:", err2.message);
    }
  }
}

parseLint();
