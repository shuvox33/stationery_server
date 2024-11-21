import app from './app';
import mongoose from 'mongoose';
import config from './config';

async function main() {
  try {
    await mongoose.connect(config.Mongodb_url as string);
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
