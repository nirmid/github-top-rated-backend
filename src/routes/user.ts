import { Router } from "express";
import { userController } from "../controllers/user";

export const userRoutes: Router = Router();

/**
 * @openapi
 * /user/getFavorites:
 * get:
 *  summary: Get favorite repositories
 * description: Get favorite repositories
 * responses:
 * 200:
 * description: Success
 * 401:
 * description: Unauthorized
 *
 */
userRoutes.get("/getFavorites", userController.getFavoriteRepositories);
/**
 * @openapi
 * /user/updateFavorites:
 * post:
 * summary: Update favorite repositories
 * description: Update favorite repositories
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * repos:
 * type: RepoData[]
 * required:
 * - repos
 * responses:
 * 200:
 * description: Success
 * 401:
 * description: Unauthorized
 */
userRoutes.post("/updateFavorites", userController.updateFavoriteRepositories);
/**
 * @openapi
 * /user/removeFavorites:
 * put:
 * summary: Remove favorite repositories
 * description: Remove favorite repositories
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * repos:
 * type: number[]
 * required:
 * - repos
 * responses:
 * 200:
 * description: Success
 * 401:
 * description: Unauthorized
 */
userRoutes.put("/removeFavorites", userController.removeFavoriteRepositories);
/**
 * @openapi
 * /user/getMostStarred:
 * get:
 * summary: Get most starred repositories
 * description: Get most starred repositories
 * responses:
 * 200:
 * description: Success
 * 401:
 * description: Unauthorized
 */
userRoutes.get("/getMostStarred", userController.getMostStarredRepositories);
