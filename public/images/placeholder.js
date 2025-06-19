// This is a helper script to generate placeholder images using canvas
// Run once during build time

const fs = require('fs');
const { createCanvas } = require('canvas');

// Generate simple placeholder images
function generatePlaceholder(width, height, text, filename) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#3a86ff';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = `${Math.max(width, height) * 0.1}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width/2, height/2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/images/${filename}`, buffer);
  console.log(`Generated: ${filename}`);
}

// Generate all needed placeholders
generatePlaceholder(80, 80, 'Logo 1', 'placeholder-logo-1.png');
generatePlaceholder(80, 80, 'Logo 2', 'placeholder-logo-2.png');
generatePlaceholder(80, 80, 'Logo 3', 'placeholder-logo-3.png');
generatePlaceholder(40, 40, 'User', 'placeholder-avatar.png');
generatePlaceholder(600, 400, 'Project', 'placeholder-project.png');
generatePlaceholder(200, 200, 'Texture', 'matcap.jpg');

console.log('All placeholders generated successfully!');
