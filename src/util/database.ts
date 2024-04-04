import { Sequelize } from "sequelize";

// for the sake of the exercise and for the convience of the reader, we will use sqlite
// for real world applications, you should use a real database like postgresql
// when using a non-in-memory database we would get the following as enviornment variables
const password = "password";
const user = "user";
const database = "database";

export const sequelize = new Sequelize(database, user, password, {
  host: "localhost",
  dialect: "sqlite",
});
