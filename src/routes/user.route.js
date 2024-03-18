import { Router } from "express";
import {
  changeUserPassword,
  getprofile,
  loginUser,
  logoutUser,
  registerUser,
  voteCandidate,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = Router();

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/sign-out").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT, getprofile);
router.route("/profile/password").post(verifyJWT, changeUserPassword);
router.route("/:userId/:candidateId").post(verifyJWT, voteCandidate);
export default router;
