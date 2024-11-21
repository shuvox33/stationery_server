import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  Mongodb_url: process.env.MONGO_DATABASE_URL,
};
