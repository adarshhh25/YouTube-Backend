import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, //CORS tells our server to accept request from different origins //This time it is allowing this origin only,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
); // express.json converts incoming json data to js object, also limits the data

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
); // express.urlencoded converts URL-encoded data from the request body into a JavaScript object, making it accessible via req.body.

app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import tweetRoutes from "./routes/tweet.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos",  videoRouter);
app.use("/api/tweets", tweetRoutes);
//http://localhost:8000/api/v1/users/register

export { app };
