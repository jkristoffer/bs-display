import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function analyzeCSSBundle() {
  // Try both possible CSS locations
  const possibleDirs = [
    path.join(__dirname, '../dist/client/_astro'),
    path.join(__dirname, '../dist/client/assets')
  ];
  
  let distDir = null;
  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const cssFiles = files.filter(file => file.endsWith('.css'));
      if (cssFiles.length > 0) {
        distDir = dir;
        break;
      }
    }
  }
  
  console.log('🔍 CSS Bundle Analysis');
  console.log('====================');
  
  if (!distDir) {
    console.log('❌ No CSS files found in build directories. Run `npm run build:fast` first.');
    console.log('Checked directories:', possibleDirs);
    return;
  }
  
  console.log(`📁 Found CSS in: ${distDir}`);
  
  const files = fs.readdirSync(distDir);
  const cssFiles = files.filter(file => file.endsWith('.css'));
  
  if (cssFiles.length === 0) {
    console.log('❌ No CSS files found in dist directory.');
    return;
  }
  
  let totalSize = 0;
  const fileStats = [];
  
  cssFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    
    fileStats.push({
      name: file,
      size: sizeKB,
      sizeBytes: stats.size
    });
    
    console.log(`📄 ${file}: ${sizeKB}KB`);
  });
  
  console.log('====================');
  console.log(`📊 Total CSS Size: ${(totalSize / 1024).toFixed(2)}KB`);
  console.log(`📁 Number of CSS files: ${cssFiles.length}`);
  
  // Identify largest files
  const sortedFiles = fileStats.sort((a, b) => b.sizeBytes - a.sizeBytes);
  console.log('\n🔥 Largest CSS files:');
  sortedFiles.slice(0, 3).forEach((file, index) => {
    console.log(`${index + 1}. ${file.name}: ${file.size}KB`);
  });
  
  return {
    totalSize: totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    fileCount: cssFiles.length,
    files: fileStats
  };
}

// Run if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeCSSBundle();
}

export { analyzeCSSBundle };