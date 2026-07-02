const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../content/blog');
const projectDir = path.join(__dirname, '../content/project');

function fixFrontmatter(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove carriage returns and normalize line endings
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Fix any trailing spaces or invisible characters in frontmatter
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      // Trim trailing whitespace from each line
      return line.trimEnd();
    });
    
    const fixedContent = fixedLines.join('\n');
    
    // Write back the fixed content
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function fixAllFiles(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory ${directory} does not exist`);
    return;
  }

  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    if (file.endsWith('.mdx')) {
      const filePath = path.join(directory, file);
      fixFrontmatter(filePath);
    }
  });
}

console.log('Fixing blog posts...');
fixAllFiles(blogDir);

console.log('Fixing project files...');
fixAllFiles(projectDir);

console.log('Done! All MDX files have been cleaned up.');
