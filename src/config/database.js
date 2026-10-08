import { Sequelize } from "sequelize";

const requiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}`);
  }
  return value;
};

const sequelize = new Sequelize(
  requiredEnv("DB_NAME"),
  requiredEnv("DB_USER"),
  process.env.DB_PASSWORD || "",
  {
    host: requiredEnv("DB_HOST"),
    dialect: "mysql",
  },
);

export default sequelize;