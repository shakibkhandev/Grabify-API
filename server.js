const app = require("./app");
const connectDB = require("./db/connectDB");

const startServer = () => {
  app.listen(process.env.PORT || 8080, async () => {
    try {
      await connectDB();
      console.log(
        `📑 Visit the documentation at: http://localhost:${
          process.env.PORT || 8080
        }`
      );
      console.log("⚙️  Server is running on port: " + process.env.PORT);
    } catch (e) {
      console.log(e);
    }
  });
};

startServer();
