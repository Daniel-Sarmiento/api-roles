const path = require('path');
const fs = require('fs');

const guardarArchivo = (archivo, nombre) => {
    return new Promise((resolve, reject) => {
        try {
            if (!archivo) {
                reject("el archivo es obligatorio");
            }
    
            const uploadPath = path.join(__dirname, '../../uploads', nombre);
            
            archivo.mv(uploadPath, (err) => {
                if (err) {
                    reject(err);
                }
    
                resolve(uploadPath);
            });
        } catch (error) {
            reject(error.message);
        }
    });
}

const guardarArchivoB64 = (archivoB64, nombre) => {
    const archivo = Buffer.from(archivoB64, 'base64');
    const uploadPath = path.join(__dirname, '../../uploads', nombre);

    fs.writeFileSync(uploadPath, archivo);
}

module.exports = {
    guardarArchivo,
    guardarArchivoB64
}