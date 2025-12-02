const express = require("express");
const cors = require("cors");

const router = express.Router();

// Import Controllers
const {
  studentRegister,
  verifyEmail,
  verified,
  studentLogin,
  studentLogout,
} = require("../controllers/studentAuth");

// 🛠️ Middleware Configuration
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
router.use(express.json()); // Ensure JSON requests are handled

// 📝 Auth Routes
router.post("/register", studentRegister);  // 🟢 Register
router.post("/login", studentLogin);       // 🟢 Login
router.post("/logout", studentLogout);     // 🔴 Logout

// 📩 Email Verification Routes
router.get("/verify/:studentId/:uniqueString", verifyEmail); // Verify email link
router.get("/verified", verified);  // Email verification page

// ❌ Error Handling Middleware (Optional)
// router.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ err: "Internal Server Error" });
// });

module.exports = router;
