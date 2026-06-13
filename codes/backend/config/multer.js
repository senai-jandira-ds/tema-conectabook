const multer = require('multer');

// Configura o multer para usar a memória RAM (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;