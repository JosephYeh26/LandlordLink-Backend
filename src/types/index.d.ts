import { IUser } from "../models/userModel";

declare global {
  namespace Express {
    interface JwtPayload {
      _id: string;
      // Add any other fields your JWT payload contains
    }
    interface Request {
      user?: JwtPayload;
      file?: Express.Multer.File;
    }
  }
}
