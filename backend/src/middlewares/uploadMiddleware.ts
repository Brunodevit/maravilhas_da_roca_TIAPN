import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Garante que a pasta de uploads existe
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura o armazenamento do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Salva na pasta public/uploads do seu backend
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo usando a data atual + nome original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });