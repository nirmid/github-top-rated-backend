import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize"
import { sequelize } from "../util/database";

class Repo extends Model<InferAttributes<Repo>, InferCreationAttributes<Repo>> {
    public id!: number;
    public fullName!: string;
    public language!: string;
    public stars!: number;
    public description!: string;
    public link!: string;
}

Repo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "repos",
    sequelize: sequelize
});

export { Repo };