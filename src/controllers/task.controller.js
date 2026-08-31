import Task from "../models/task.model.js";

// Crear tarea
export const createTask = async (req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Título y descripción son obligatorios" });
    }
    if (title.length > 100 || description.length > 100) {
      return res.status(400).json({ error: "Título y descripción no pueden superar 100 caracteres" });
    }

    // Verificar título único
    const existingTask = await Task.findOne({ where: { title } });
    if (existingTask) {
      return res.status(400).json({ error: "El título ya existe" });
    }

    const newTask = await Task.create({ title, description, isComplete: isComplete || false });
    res.status(201).json({ message: "Tarea creada", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las tareas
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener tarea por ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar tarea
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    if (title && title.length > 100) {
      return res.status(400).json({ error: "El título no puede superar 100 caracteres" });
    }
    if (description && description.length > 100) {
      return res.status(400).json({ error: "La descripción no puede superar 100 caracteres" });
    }

    // Verificar título único si se cambia
    if (title && title !== task.title) {
      const existingTask = await Task.findOne({ where: { title } });
      if (existingTask) {
        return res.status(400).json({ error: "El título ya está en uso" });
      }
    }

    await task.update({ title, description, isComplete });
    res.status(200).json({ message: "Tarea actualizada", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar tarea
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    await task.destroy();
    res.status(200).json({ message: "Tarea eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};