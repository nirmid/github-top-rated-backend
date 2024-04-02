import { DataTypes, Optional, Model, InferAttributes, InferCreationAttributes } from "sequelize"
import { sequelize } from "../util/database";

interface UserAttributes {
    id: number;
    username: string;
    password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
    public id!: number;
    public username!: string;
    public password!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "users",
    sequelize: sequelize
});


export { User };