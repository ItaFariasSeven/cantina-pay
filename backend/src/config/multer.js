const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
  storage: multer.diskStorage({
    // Define para onde a foto vai (a pasta uploads que você criou)
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    // Renomeia o arquivo com letras aleatórias para não dar conflito
    filename: (req, file, cb) => {
      const hash = crypto.randomBytes(16).toString('hex');
      const filename = `${hash}-${file.originalname}`;
      cb(null, filename);
    },
  }),
};
