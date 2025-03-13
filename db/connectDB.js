const mongoose = require("mongoose");
const connection = {};

module.exports = connectDB = async () => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const instance = await mongoose.connect(
      `${
        process.env.NODE_ENV === "production"
          ? process.env.MONGO_DB_URI_PRO
          : process.env.MONGO_DB_URI_DEV
      }`,
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    connection.isConnected = instance.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
};
