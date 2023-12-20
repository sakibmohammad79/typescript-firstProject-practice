import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';

export const sendImageToCloudinary = () => {
  cloudinary.config({
    cloud_name: config.cloud_name_cloudinary,
    api_key: config.api_kay_cloudinary,
    api_secret: config.api_secret_cloudinary,
  });

  cloudinary.uploader.upload(
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
    { public_id: 'olympic_flag' },
    function (error, result) {
      console.log(result);
    }
  );
};

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
