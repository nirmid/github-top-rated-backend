import { DataTypes, Optional, Model, InferAttributes, InferCreationAttributes } from "sequelize"
import { sequelize } from "../util/database";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
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