import {User} from "./user";
import {Repo} from "./repository";
import {sequelize} from "../util/database";


const UserRepository = sequelize.define('UserRepository', {});
User.belongsToMany(Repo, {through: "UserRepository"});
Repo.belongsToMany(User, {through: "UserRepository"});


export {User, Repo, UserRepository};


