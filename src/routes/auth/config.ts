import express from "express";
import { signUp } from "../../controllers/auth/signupController";
import { validate } from "../../middlewares/auth/validate";
import { checkUserAuth, verifyToken } from "../../middlewares/auth/checkUserAuth";
import { login, logout, refreshToken } from "../../controllers/auth/loginController";
import { updateEmail, updatePassword, updateUsername } from "../../controllers/users/userController";

const router = express.Router()

router.route("/logout").get(logout)
router.route("/refresh").get(refreshToken)
router.route("/register").post(validate,signUp)
router.route("/login").post(checkUserAuth,login)
router.route("/update/email").put(verifyToken,updateEmail)
router.route("/update/password").put(verifyToken,updatePassword)
router.route("/update/username").put(verifyToken,updateUsername)


export default router;