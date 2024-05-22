import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { AuthService } from "../service/auth";

describe("AuthService", () => {
  describe("signup", () => {
    it("should create a new user and return the user ID", async () => {
      const mockUser = {
        id: 1,
        username: "nir",
        password: "123",
      };
      const mockCreate = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(User, "create").mockImplementation(mockCreate);

      const userId = await AuthService.signup(
        mockUser.username,
        mockUser.password
      );

      expect(userId).toBe(mockUser.id);
      jest.clearAllMocks();
    });
  });

  describe("login", () => {
    it("should authenticate a user and return a token", async () => {});

    it("should throw an error if username is incorrect", async () => {
      const mockUser = {
        id: 1,
        username: "nir",
        password: "123",
      };
      const mockFind = jest.fn().mockResolvedValue(null);
      jest.spyOn(User, "findOne").mockImplementation(mockFind);
      await expect(
        AuthService.login(mockUser.username, mockUser.password)
      ).rejects.toThrow("A user with this username can't be found");
    });

    it("should throw an error if password is incorrect", async () => {
      const mockUser = {
        id: 1,
        username: "nir",
        password: "123",
      };
      const mockFind = jest.fn().mockResolvedValue(mockUser);
      const mockCompare = jest.fn().mockResolvedValue(false);
      jest.spyOn(bcrypt, "compare").mockImplementation(mockCompare);
      jest.spyOn(User, "findOne").mockImplementation(mockFind);
      await expect(
        AuthService.login(mockUser.username, mockUser.password)
      ).rejects.toThrow("Wrong password!");
    });
  });
});
