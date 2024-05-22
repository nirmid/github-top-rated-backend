import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { RepoData } from "../types/repoData";
import { UserServices } from "../service/user";

const getFavoriteRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = req.body.userId.user_id;
    const favoriteRepos = await UserServices.getFavoriteRepositories(userId);
    return res.status(200).json(favoriteRepos);
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
    await UserServices.updateFavoriteRepositories(favoriteRepos, userId);
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
    await UserServices.removeFavoriteRepositories(favoriteRepos, userId);
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
