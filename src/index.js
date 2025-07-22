import dotenv from "dotenv";
dotenv.config({});
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server Running At Port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection Failed", error);
  });

//Another Way To Connect MongoDB with Node.js
/* import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MOGODB_URL}`);
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is Listening on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR", error);
    throw error;
  }
})();
*/
