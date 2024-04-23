import { UserServices } from "../service/user";
import { UserRepositoryDB, UserRepositoryModel } from "../models/assosiaction";
import { getRepoById } from "../models/repository";
import { Repo } from "../models/repository";
import { RepoData } from "../types/repoData";

describe("UserServices", () => {
  describe("getFavoriteRepositories", () => {
    it("should return favorite repositories", async () => {
      const mockUserRepositoryModel = [
        { id: 1, UserId: 1, RepoId: 1 },
      ] as UserRepositoryModel[];
      const mockFavoriteRepo = {
        fullName: "Test Repo",
        language: "TypeScript",
        stars: 100,
        description: "Test repository",
        link: "https://github.com/test-repo",
        repoId: 1,
      } as RepoData;
      const mockFavoriteRepoWithId = { id: 1, ...mockFavoriteRepo } as Repo;
      jest
        .spyOn(UserRepositoryDB, "getFavoriteRepositoriesFromDB")
        .mockResolvedValue(mockUserRepositoryModel);
      jest.spyOn(Repo, "findOne").mockResolvedValue(mockFavoriteRepoWithId);

      const userId = 1;
      const repoData = await UserServices.getFavoriteRepositories(userId);

      expect(repoData).toEqual([mockFavoriteRepo]);

      expect(
        UserRepositoryDB.getFavoriteRepositoriesFromDB
      ).toHaveBeenCalledWith(userId);
      expect(Repo.findOne).toHaveBeenCalledTimes(
        mockUserRepositoryModel.length
      );
    });
  });
  describe("updateFavoriteRepositories", () => {
    it("should add favorite repositories", async () => {
      const mockFavoriteRepos = [
        {
          fullName: "Test Repo",
          language: "TypeScript",
          stars: 100,
          description: "Test repository",
          link: "https://github.com/test-repo",
          repoId: 1,
        },
      ] as RepoData[];
      const mockUserId = 1;
      const mockUpdateFavoriteRepo = jest.fn();
      jest
        .spyOn(UserRepositoryDB, "updateFavoriteRepo")
        .mockImplementation(mockUpdateFavoriteRepo);

      await UserServices.updateFavoriteRepositories(
        mockFavoriteRepos,
        mockUserId
      );

      expect(mockUpdateFavoriteRepo).toHaveBeenCalledTimes(
        mockFavoriteRepos.length
      );
      expect(mockUpdateFavoriteRepo).toHaveBeenCalledWith(
        mockFavoriteRepos[0],
        mockUserId
      );
    });
  });

  describe("removeFavoriteRepositories", () => {
    it("should remove favorite repositories", async () => {
      const mockFavoriteRepos = [
        {
          fullName: "Test Repo",
          language: "TypeScript",
          stars: 100,
          description: "Test repository",
          link: "https://github.com/test-repo",
          repoId: 1,
        },
      ] as RepoData[];
      const mockUserId = 1;
      const mockRemoveFavoriteRepo = jest.fn();
      jest
        .spyOn(UserRepositoryDB, "removeFavoriteRepo")
        .mockImplementation(mockRemoveFavoriteRepo);

      await UserServices.removeFavoriteRepositories(
        mockFavoriteRepos,
        mockUserId
      );

      expect(mockRemoveFavoriteRepo).toHaveBeenCalledTimes(
        mockFavoriteRepos.length
      );
      expect(mockRemoveFavoriteRepo).toHaveBeenCalledWith(
        mockFavoriteRepos[0],
        mockUserId
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
