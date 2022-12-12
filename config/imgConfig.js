import multer from 'multer';

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, '/tmp');
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

export default storage;
