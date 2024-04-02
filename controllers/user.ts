
// Get 30 most stared repositories
// get favorite repositories
// update favorite repositories
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { RepoData } from '../types/repo_data';

const getFavoriteRepositories = async (req:Request, res:Response, next:NextFunction) => {
    try{
        console.log(req.query.page);
        // const getResponse = await axios.get("https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=30");
    }
    catch(error){
        next(error);
    }
}

const updateFavoriteRepositories = async (req:Request, res:Response) => {
    res.status(200).json({message: "updateFavoriteRepositories"});
}

const getMostStarredRepositories = async (req:Request, res:Response,next:NextFunction) => {
    try{
        const page = req.query.page;
        const getResponse = await axios.get(`https://api.github.com/search/repositories?sort=stars&page=${page}&q=stars%3A%3E1`);
        const repoData: RepoData[] = getResponse.data.items.map((item:any) => {
            return {
                fullName: item.full_name,
                language: item.language,
                stars: item.stargazers_count,
                description: item.description,
                link: item.html_url
            }
        });
        return res.status(200).json(repoData);
    }
    catch(error){
        next(error);
    }
}

export const userController = {
    getFavoriteRepositories,
    updateFavoriteRepositories,
    getMostStarredRepositories
}

