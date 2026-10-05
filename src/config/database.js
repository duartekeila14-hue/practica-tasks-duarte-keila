import { Sequelize } from "sequelize";

// Conexion a la base de datos MySQL "tasks_users_db".
// Cambiar "TU_PASSWORD" por la contraseña de tu MySQL.
const sequelize = new Sequelize("tasks_users_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;