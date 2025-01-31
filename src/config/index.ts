import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  Mongodb_url: process.env.MONGO_DATABASE_URL,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  nodeEnv: process.env.NODE_ENV,
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  sp: {
    sp_endpoint: process.env.SP_ENDPOINT,
    sp_username: process.env.SP_USERNAME,
    sp_password: process.env.SP_PASSWORD,
    sp_prefix: process.env.SP_PREFIX,
    sp_return_url: process.env.SP_RETURN_URL,
  },
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
