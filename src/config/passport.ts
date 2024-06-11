import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as AppleStrategy,
  Profile as AppleProfile,
} from "passport-apple";
import User, { IUser } from "../models/userModel";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser: IUser = new User({
          username: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
          isAccreditedInvestor: false,
          referralSource: "Google",
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// passport.use(
//   new AppleStrategy(
//     {
//       clientID: process.env.APPLE_CLIENT_ID as string,
//       teamID: process.env.APPLE_TEAM_ID as string,
//       keyID: process.env.APPLE_KEY_ID as string,
//       privateKeyString: process.env.APPLE_PRIVATE_KEY as string,
//       callbackURL: "/api/auth/apple/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ appleId: profile.id });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser: IUser = new User({
//           username: profile.displayName,
//           email: profile.emails?.[0].value,
//           appleId: profile.id,
//           isAccreditedInvestor: false,
//           referralSource: "Apple",
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );
