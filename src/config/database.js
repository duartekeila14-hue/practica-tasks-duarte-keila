import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;