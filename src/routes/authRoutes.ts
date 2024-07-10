import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

import passport from "passport";
import jwt from "jsonwebtoken";
import { IUser } from "../models/userModel";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const user = req.user as IUser;
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      const redirectUrl = `http://localhost:3000?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`;
      res.redirect(redirectUrl);
      console.log(token + " and " + user);
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

router.get("/apple", passport.authenticate("apple"));
router.post(
  "/apple/callback",
  passport.authenticate("apple", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: (req.user as IUser)._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.redirect(`/?token=${token}`);
  }
);

export default router;
