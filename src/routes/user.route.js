import { Router } from "express";
import {
  changeUserPassword,
  getprofile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = Router();

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/profile").get(verifyJWT, getprofile);
router.route("/profile/password").post(verifyJWT, changeUserPassword);
router.route("/sign-out").post(verifyJWT, logoutUser);
export default router;
