import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { CustomError } from "../classes/custom_error";
import dotenv from "dotenv";
dotenv.config();

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    signupReq(req, res, next);
  } catch (err) {
    next(err);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    loginReq(req, res, next);
  } catch (err) {
    next(err);
  }
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authenticator"];
  const token = authHeader && (authHeader as string).split(" ")[1]; // Bearer, token
  console.log("token", token);
  if (token == null) {
    const error = new CustomError("No Token!");
    error.statusCode = 401;
    next(error);
  }
  jwt.verify(token!, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      const error = new CustomError("Unauthorized");
      error.statusCode = 401;
      next(error);
    }
    req.body["userId"] = user;
    console.log("user", user);
    next();
  });
};

const signupReq = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("req", req.body);
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User Created!", user_id: user.id });
  } catch (error) {
    next(error);
  }
};

const loginReq = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new CustomError("A user with this username can't be found");
      error.statusCode = 401;
      next(error);
    }
    const loadedUser = user!.dataValues;
    const isEqual = await bcrypt.compare(password, user!.password);
    if (!isEqual) {
      const error = new CustomError("Wrong password!");
      error.statusCode = 401;
      next(error);
    }
    const token = jwt.sign(
      {
        user_name: loadedUser.username,
        user_id: loadedUser.id.toString(),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, user_id: loadedUser.id.toString() });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  signup,
  login,
  authenticateToken,
};
