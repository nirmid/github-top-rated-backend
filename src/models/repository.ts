import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../util/database";

interface RepoAttributes {
  id: number;
  fullName: string;
  language: string;
  stars: number;
  description: string;
  link: string;
  repoId: number;
}

interface RepoCreationAttributes extends Optional<RepoAttributes, "id"> {}

class Repo extends Model<RepoAttributes, RepoCreationAttributes> {
  public id!: number;
  public fullName!: string;
  public language!: string;
  public stars!: number;
  public description!: string;
  public link!: string;
  public repoId!: number;
}

Repo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "repos",
    sequelize: sequelize,
  }
);

const getRepoById = async (repoId: number): Promise<Repo | null> => {
  return Repo.findByPk(repoId);
};

export { Repo, getRepoById };
