import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1, //Kitne files accept karna hai
    },
    {
      name: "coverImage",
      maxCount: 1, //Kitne files accept karna hai
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(jwtVerify, logoutUser);

router.route("refresh-token").post(refreshAccessToken);

router.route("/change-password").post(jwtVerify, changeCurrentPassword);

router.route("/current-User").get(jwtVerify, getCurrentUser);

router.route("/update-account").patch(jwtVerify, updateAccountDetails);

router
  .route("/avatar")
  .patch(jwtVerify, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(jwtVerify, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(jwtVerify, getUserChannelProfile);

router.route("/history").get(jwtVerify, getWatchHistory);

export default router;
