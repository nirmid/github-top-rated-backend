import {Router} from 'express';
import {userController} from "../controllers/user";

export const userRoutes: Router = Router();

userRoutes.get("/getFavorites",userController.getFavoriteRepositories);
userRoutes.post("/updateFavorites",userController.updateFavoriteRepositories);
userRoutes.get("/getMostStarred",userController.getMostStarredRepositories);


