import { User } from "./user";
import { Repo } from "./repository";
import { sequelize } from "../util/database";
import { RepoData } from "../types/repoData";
import { Model, Optional } from "sequelize";

export class UserRepositoryModel extends Model {
  id!: number;
  UserId!: number;
  RepoId!: number;
}

const UserRepository = sequelize.define(
  "UserRepository",
  {},
  { timestamps: false }
);
User.belongsToMany(Repo, { through: "UserRepository" });
Repo.belongsToMany(User, { through: "UserRepository" });

const updateFavoriteRepo = async (repo: RepoData, userId: number) => {
  const databaseRepoId = await Repo.findOne({
    where: { repoId: repo.repoId },
  });
  if (databaseRepoId) {
    await UserRepository.create({ UserId: userId, RepoId: databaseRepoId });
  } else {
    sequelize.transaction(async (t) => {
      const newRepo = await Repo.create(
        {
          fullName: repo.fullName,
          language: repo.language,
          stars: repo.stars,
          description: repo.description,
          link: repo.link,
          repoId: repo.repoId,
        },
        { transaction: t }
      );
      await UserRepository.create(
        { UserId: userId, RepoId: newRepo.id },
        { transaction: t }
      );
    });
  }
};

const getFavoriteRepositoriesFromDB = async (userId: number) => {
  return UserRepository.findAll({
    where: { UserId: userId },
  }) as Promise<UserRepositoryModel[]>;
};

const removeFavoriteRepo = async (repo: RepoData, userId: number) => {
  const databaseRepoId = await Repo.findOne({
    where: { repoId: repo.repoId },
  });
  if (databaseRepoId) {
    await UserRepository.destroy({
      where: { UserId: userId, RepoId: databaseRepoId.id },
    });
  }
};

export const UserRepositoryDB = {
  updateFavoriteRepo,
  getFavoriteRepositoriesFromDB,
  removeFavoriteRepo,
};
