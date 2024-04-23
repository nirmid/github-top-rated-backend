import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { CustomError } from "../classes/custom_error";
import dotenv from "dotenv";
dotenv.config();

const login = async (username: string, password: string): Promise<Object> => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new CustomError("A user with this username can't be found");
      error.statusCode = 401;
      throw error;
    }
    const loadedUser = user!.dataValues;
    const isEqual = await bcrypt.compare(password, user!.password);
    if (!isEqual) {
      const error = new CustomError("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        user_name: loadedUser.username,
        user_id: loadedUser.id.toString(),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return { token, user_id: loadedUser.id.toString() };
  } catch (error) {
    throw error;
  }
};

const signup = async (username: string, password: string): Promise<number> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    return user.id;
  } catch (error) {
    throw error;
  }
};

const authenticateToken = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token!, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        const error = new CustomError("Unauthorized");
        error.statusCode = 401;
        reject(error);
      }
      resolve(user);
    });
  });
};

export const AuthService = {
  login,
  signup,
  authenticateToken,
};
