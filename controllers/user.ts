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
    const userId = Number(req.body.user.userId);
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const favoriteRepos = await UserRepository.findAll({
      where: { userId: userId },
    });
    const repoDataPromises: Promise<RepoData>[] = favoriteRepos.map(
      async (item: any) => {
        const repo = await Repo.findByPk(item.repoId);
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
    const favoriteRepos = req.body.favoriteRepos;
    const userId: number = req.body.user.userId;
    for (const repo of favoriteRepos) {
      const repoId = await Repo.findOne({ where: { repoId: repo.repoId } });
      if (repoId) {
        await UserRepository.create({ userId: userId, repoId: repoId });
      } else {
        const newRepo = await Repo.create({
          fullName: repo.fullName,
          language: repo.language,
          stars: repo.stars,
          description: repo.description,
          link: repo.link,
          repoId: repo.repoId,
        });
        await UserRepository.create({ userId: userId, repoId: newRepo });
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
        language: item.language,
        stars: item.stargazers_count,
        description: item.description,
        link: item.html_url,
        repoId: item.id,
      };
    });
    return res.status(200).json(repoData);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getFavoriteRepositories,
  updateFavoriteRepositories,
  getMostStarredRepositories,
};
