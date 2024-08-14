const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const output = fs.createWriteStream('dist.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const fileSize = fs.statSync('dist.zip').size;
  const sizeLimit = 13 * 1024; // 13 KB in bytes
  if (fileSize > sizeLimit) {
    console.log(`El archivo ZIP es mayor a 13KB. Tamaño: ${fileSize} bytes`);
  } else {
    console.log(`El archivo ZIP tiene ${sizeLimit - fileSize} bytes disponibles para llegar a 13KB`);
  }
});

archive.pipe(output);
archive.file(path.join('dist', 'index.html'), { name: 'index.html' });
archive.finalize();
