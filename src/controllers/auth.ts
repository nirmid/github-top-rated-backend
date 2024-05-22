import { Request, Response, NextFunction } from "express";
import { CustomError } from "../classes/custom_error";
import { AuthService } from "../service/auth";
import dotenv from "dotenv";
dotenv.config();

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const userId = await AuthService.signup(username, password);
    res.status(201).json({ message: "User Created!", user_id: userId });
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
    const { username, password } = req.body;
    const token = await AuthService.login(username, password);
    res.status(200).json(token);
  } catch (err) {
    next(err);
  }
};

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authenticator"];
  const token = authHeader && (authHeader as string).split(" ")[1]; // Bearer, token
  if (token == null) {
    const error = new CustomError("No Token!");
    error.statusCode = 401;
    next(error);
  }
  try {
    const user = await AuthService.authenticateToken(token!);
    req.body["userId"] = user;
    next();
  } catch (err) {
    next(err);
  }
};

// const signupReq = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const user = await User.create({
//       username,
//       password: hashedPassword,
//     });
//     res.status(201).json({ message: "User Created!", user_id: user.id });
//   } catch (error) {
//     next(error);
//   }
// };

// const loginReq = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       const error = new CustomError("A user with this username can't be found");
//       error.statusCode = 401;
//       next(error);
//     }
//     const loadedUser = user!.dataValues;
//     const isEqual = await bcrypt.compare(password, user!.password);
//     if (!isEqual) {
//       const error = new CustomError("Wrong password!");
//       error.statusCode = 401;
//       next(error);
//     }
//     const token = jwt.sign(
//       {
//         user_name: loadedUser.username,
//         user_id: loadedUser.id.toString(),
//       },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1h" }
//     );
//     res.status(200).json({ token, user_id: loadedUser.id.toString() });
//   } catch (error) {
//     next(error);
//   }
// };

export const authController = {
  signup,
  login,
  authenticateToken,
};
