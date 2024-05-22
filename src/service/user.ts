import { RepoData } from "../types/repoData";
import { getRepoById } from "../models/repository";
import { UserRepositoryDB } from "../models/assosiaction";

const getFavoriteRepositories = async (userId: number): Promise<RepoData[]> => {
  const favoriteRepos = await UserRepositoryDB.getFavoriteRepositoriesFromDB(
    userId
  );
  const repoDataPromises: Promise<RepoData>[] = favoriteRepos.map(
    async (item: any) => {
      const repo = await getRepoById(item.RepoId);
      if (!repo) {
        throw new Error("Repo not found");
      }
      return {
        fullName: repo.fullName,
        language: repo.language,
        stars: repo.stars,
        description: repo.description,
        link: repo.link,
        repoId: repo.repoId,
      };
    }
  );
  const repoDataResults: PromiseSettledResult<RepoData>[] =
    await Promise.allSettled(repoDataPromises);

  const repoData: RepoData[] = repoDataResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<RepoData>).value);
  return repoData;
};

const updateFavoriteRepositories = async (
  favoriteRepos: RepoData[],
  userId: number
): Promise<void> => {
  const updateFavoritePromises: Promise<void>[] = favoriteRepos.map(
    async (repo) => {
      await UserRepositoryDB.updateFavoriteRepo(repo, userId);
    }
  );
  await Promise.all(updateFavoritePromises);
};

const removeFavoriteRepositories = async (
  favoriteRepos: RepoData[],
  userId: number
): Promise<void> => {
  const removeFavoritePromises: Promise<void>[] = favoriteRepos.map(
    async (repo) => {
      await UserRepositoryDB.removeFavoriteRepo(repo, userId);
    }
  );
  await Promise.all(removeFavoritePromises);
};

export const UserServices = {
  getFavoriteRepositories,
  updateFavoriteRepositories,
  removeFavoriteRepositories,
};
