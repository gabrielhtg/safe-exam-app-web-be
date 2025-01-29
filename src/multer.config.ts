import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const uploadProfilePict = {
  storage: diskStorage({
    destination: join(__dirname, '..', 'public/profile_pict'),
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

export const uploadCoursePict = {
  storage: diskStorage({
    destination: join(__dirname, '..', 'public/course_pict'),
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${file.fieldname}-${uniqueSuffix}.png`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

export const uploadResultFile = {
  storage: diskStorage({
    destination: join(__dirname, '..', 'public/exam_result_file'),
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${file.originalname.split('.')[0]}-${uniqueSuffix}.${file.originalname.split('.')[1]}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
