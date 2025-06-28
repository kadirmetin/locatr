import mongoose from "mongoose";

import { config } from "../configs/app.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    await mongoose.connection.db?.admin().command({ ping: 1 });

    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.log("Error connecting to MongoDB Database! ", error);

    process.exit(1);
  }
};

export default connectDatabase;
