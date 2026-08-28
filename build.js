const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'build');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'app.js',
  'styles.css',
  'favicon.svg',
  'xyz_university_logo.jpg',
  'soundEngine.js',
  'vercel.json'
];

filesToCopy.forEach((file) => {
  const src = path.join(__dirname, file);
  const dest = path.join(outDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> build/${file}`);
  }
});

console.log('Build completed successfully: All static assets assembled in ./build');
