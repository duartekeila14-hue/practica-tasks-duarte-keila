import "dotenv/config";
import express from "express";
import sequelize from "./src/config/database.js";
import userRoutes from "./src/routes/user.routes.js";
import taskRoutes from "./src/routes/task.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const iniciarServidor = async () => {
  try {
    await sequelize.sync();
    console.log("Conexion a MySQL exitosa, tablas sincronizadas");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error.message);
    process.exitCode = 1;
  }
};

iniciarServidor();
