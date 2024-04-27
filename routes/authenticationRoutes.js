const express = require("express");
const app = express();
const upload = require("../middlewares/fileStorage");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const {
  authValidation,
  handleAuthErrors,
} = require("../validations/authenticationValidation");
const {
  registerUser,
  loginUser,
  verifyUser,
  updatePassword,
  resetPasswordEmail,
  verifyResetEmail,
  resetPassword,
  getProfile,
  updateProfile,
  getUserAccounts,
} = require("../controllers/authenticationController");

router.post(
  "/register",
  upload.any(),
  authValidation,
  handleAuthErrors,
  registerUser
);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.put("/updatePw", updatePassword);
router.post("/resetPwVerify", resetPasswordEmail);
router.post("/verifyReset", verifyResetEmail);
router.put("/resetPw", resetPassword);
// router.use(upload.any(), authMiddleware); //auth middleware
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", upload.any(), authMiddleware, updateProfile);
router.get("/users", authMiddleware, getUserAccounts);

module.exports = router;
