import Task from "../models/task.model.js";


const esTextoValido = (valor) =>
  typeof valor === "string" && valor.trim() !== "" && valor.length <= 100;


const validarDatosTarea = ({ title, description, isComplete }) => {
  if (!esTextoValido(title)) {
    return "title debe ser un texto no vacio de maximo 100 caracteres";
  }
  if (!esTextoValido(description)) {
    return "description debe ser un texto no vacio de maximo 100 caracteres";
  }
  
  if (isComplete !== undefined && typeof isComplete !== "boolean") {
    return "isComplete debe ser un valor booleano";
  }
  return null;
};

export const createTask = async (req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    const errorValidacion = validarDatosTarea(req.body);
    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    //  no puede haber dos tareas con el mismo titulo
    const tituloExistente = await Task.findOne({ where: { title } });
    if (tituloExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe una tarea con ese titulo" });
    }

    const nuevaTarea = await Task.create({ title, description, isComplete });
    return res.status(201).json({
      message: "Tarea creada correctamente",
      task: nuevaTarea,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la tarea",
      error: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tareas = await Task.findAll();
    return res.status(200).json({
      message: "Tareas obtenidas correctamente",
      tasks: tareas,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las tareas",
      error: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const tarea = await Task.findByPk(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    return res.status(200).json({
      message: "Tarea obtenida correctamente",
      task: tarea,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la tarea",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    // la tarea tiene que existir antes de editarla
    const tarea = await Task.findByPk(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const { title, description, isComplete } = req.body;

    const errorValidacion = validarDatosTarea(req.body);
    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    // el titulo puede repetirse solo si es el de la misma tarea
    const tituloExistente = await Task.findOne({ where: { title } });
    if (tituloExistente && tituloExistente.id !== tarea.id) {
      return res
        .status(400)
        .json({ message: "Ya existe otra tarea con ese titulo" });
    }

    await tarea.update({
      title,
      description,
      // si no viene isComplete, se conserva el valor que ya tenia
      isComplete: isComplete ?? tarea.isComplete,
    });
    return res.status(200).json({
      message: "Tarea actualizada correctamente",
      task: tarea,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la tarea",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    // la tarea tiene que existir antes de eliminarla
    const tarea = await Task.findByPk(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await tarea.destroy();
    return res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la tarea",
      error: error.message,
    });
  }
};
