// import passport from "passport";
// import {
//   Strategy as GoogleStrategy,
//   Profile as GoogleProfile,
// } from "passport-google-oauth20";
// import {
//   Strategy as AppleStrategy,
//   Profile as AppleProfile,
// } from "passport-apple";
// import User, { IUser } from "../models/userModel";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: "/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser: IUser = new User({
//           username: profile.displayName,
//           email: profile.emails?.[0].value,
//           googleId: profile.id,
//           isAccreditedInvestor: false,
//           referralSource: "Google",
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );

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

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/userModel";

// Type for the serialized user ID
type SerializedUser = string;

passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id.toString());
});

passport.deserializeUser(async (id: SerializedUser, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null as any);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      try {
        let user = await User.findOne({ googleId: id });

        if (!user) {
          user = new User({
            googleId: id,
            username: displayName,
            email: emails?.[0].value,
            password: "", // Set default or empty values for required fields
            propertyAddress: "", // Set default or empty values for required fields
            isAccreditedInvestor: false, // Set default or empty values for required fields
            referralSource: "Google",
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null as any);
      }
    }
  )
);

export default passport;
