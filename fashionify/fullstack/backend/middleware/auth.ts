import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.body.userId = token_decode.id;
    next();
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
