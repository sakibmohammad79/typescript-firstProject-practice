import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

export const sendImageToCloudinary = () => {
  cloudinary.config({
    cloud_name: config.cloud_name_cloudinary,
    api_key: config.api_kay_cloudinary,
    api_secret: config.api_secret_cloudinary,
  });
  //   cloudinary.config({
  //     cloud_name: 'dm126uxmv',
  //     api_key: '837489542416858',
  //     api_secret: 'CjRNK1KL2gRpBpFVInwjlGZSAmk',
  //   });

  cloudinary.uploader.upload(
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
    { public_id: 'olympic_flag' },
    function (error, result) {
      console.log(result);
    }
  );
};
