import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const uploadProfilePict = {
  storage: diskStorage({
    destination: join(__dirname, '..', 'public/profile_pict'), // Folder tempat menyimpan file
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batasan ukuran file 5MB
  },
};
