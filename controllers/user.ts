import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { RepoData } from "../types/repo_data";
import { Repo } from "../models/repository";
import { User } from "../models/user";
import { UserRepository } from "../models/assosiaction";

const getFavoriteRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = req.body.userId.user_id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const favoriteRepos = await UserRepository.findAll({
      where: { UserId: userId },
    });
    const repoDataPromises: Promise<RepoData>[] = favoriteRepos.map(
      async (item: any) => {
        const repo = await Repo.findByPk(item.RepoId);
        console.log(repo);
        return {
          fullName: repo!.fullName,
          language: repo!.language,
          stars: repo!.stars,
          description: repo!.description,
          link: repo!.link,
          repoId: repo!.repoId,
        };
      }
    );
    const repoData: RepoData[] = await Promise.all(repoDataPromises);
    return res.status(200).json(repoData);
  } catch (error) {
    next(error);
  }
};

const updateFavoriteRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const favoriteRepos = req.body.repos;
    const userId: number = req.body.userId.user_id;
    console.log(req.body.userId);
    console.log(userId);
    for (const repo of favoriteRepos) {
      const databaseRepoId = await Repo.findOne({
        where: { repoId: repo.repoId },
      });
      if (databaseRepoId) {
        await UserRepository.create({ UserId: userId, RepoId: databaseRepoId });
      } else {
        const newRepo = await Repo.create({
          fullName: repo.fullName,
          language: repo.language,
          stars: repo.stars,
          description: repo.description,
          link: repo.link,
          repoId: repo.repoId,
        });
        await UserRepository.create({ UserId: userId, RepoId: newRepo.id });
      }
    }
  } catch (error) {
    next(error);
  }
};

const removeFavoriteRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const favoriteRepos = req.body.repos;
    const userId: number = req.body.userId.user_id;
    console.log(req.body.userId);
    console.log(userId);
    for (const repo of favoriteRepos) {
      const databaseRepoId = await Repo.findOne({
        where: { repoId: repo.repoId },
      });
      if (databaseRepoId) {
        await UserRepository.destroy({
          where: { UserId: userId, RepoId: databaseRepoId.id },
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const getMostStarredRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page;
    const getResponse = await axios.get(
      `https://api.github.com/search/repositories?sort=stars&page=${page}&q=stars%3A%3E1`
    );
    const repoData: RepoData[] = getResponse.data.items.map((item: any) => {
      return {
        fullName: item.full_name,
        language: item.language || "No language specified",
        stars: item.stargazers_count,
        description: item.description,
        link: item.html_url,
        repoId: item.id,
      };
    });
    const lastPage = getLastPage(getResponse.headers.link);
    return res.status(200).json({ repoData: repoData, lastPage: lastPage });
  } catch (error) {
    next(error);
  }
};

const getLastPage = (header: string): number => {
  const links = header.split(",");

  // Define a regular expression to extract the page number from each link
  const pageRegExp = /page=(\d+)/;

  let lastPage;

  // Iterate through each link to find the one with "rel='last'"
  for (const link of links) {
    if (link.includes('rel="last"')) {
      const match = pageRegExp.exec(link);
      if (match && match[1]) {
        lastPage = parseInt(match[1]);
        break;
      }
    }
  }
  return lastPage!;
};

export const userController = {
  getFavoriteRepositories,
  updateFavoriteRepositories,
  getMostStarredRepositories,
  removeFavoriteRepositories,
};
