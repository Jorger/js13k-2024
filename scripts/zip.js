const fs = require("fs");
const archiver = require("archiver");
// const path = require('path');

// Crear un stream de escritura para el archivo ZIP
const output = fs.createWriteStream("dist.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

// Manejar el evento 'close' para saber cuándo se ha terminado de escribir el archivo ZIP
output.on("close", () => {
  const fileSize = fs.statSync("dist.zip").size;
  const sizeLimit = 13 * 1024; // 13 KB en bytes
  if (fileSize > sizeLimit) {
    console.log(
      `El archivo ZIP es mayor a 13KB. Tamaño: ${fileSize} bytes, se pasa por: `,
      fileSize - sizeLimit
    );
  } else {
    console.log(
      `El archivo ZIP tiene ${
        sizeLimit - fileSize
      } bytes disponibles para llegar a 13KB`
    );
  }
});

// Pipear el archivo ZIP al stream de salida
archive.pipe(output);

// Agregar toda la carpeta 'dist' al archivo ZIP
archive.directory("dist", false);

// Finalizar el archivo ZIP
archive.finalize();
