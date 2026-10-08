import User from "../models/user.model.js";

// Un texto es valido si es string, no esta vacio y tiene maximo 100 caracteres
const esTextoValido = (valor) =>
  typeof valor === "string" && valor.trim() !== "" && valor.length <= 100;

// Devuelve un mensaje de error si algun dato es invalido, o null si todo esta bien
const validarDatosUsuario = ({ name, email, password }) => {
  if (!esTextoValido(name)) {
    return "name debe ser un texto no vacio de maximo 100 caracteres";
  }
  if (!esTextoValido(email)) {
    return "email debe ser un texto no vacio de maximo 100 caracteres";
  }
  if (!esTextoValido(password)) {
    return "password debe ser un texto no vacio de maximo 100 caracteres";
  }
  return null;
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const errorValidacion = validarDatosUsuario(req.body);
    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    // no puede haber dos usuarios con el mismo email
    const emailExistente = await User.findOne({ where: { email } });
    if (emailExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe un usuario con ese email" });
    }

    const nuevoUsuario = await User.create({ name, email, password });
    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: nuevoUsuario,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    return res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      users: usuarios,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los usuarios",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Usuario obtenido correctamente",
      user: usuario,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    //el usuario tiene que existir antes de editarlo
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { name, email, password } = req.body;

    const errorValidacion = validarDatosUsuario(req.body);
    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    // el email puede repetirse solo si es el del mismo usuario
    const emailExistente = await User.findOne({ where: { email } });
    if (emailExistente && emailExistente.id !== usuario.id) {
      return res
        .status(400)
        .json({ message: "Ya existe otro usuario con ese email" });
    }

    await usuario.update({ name, email, password });
    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: usuario,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    //  el usuario tiene que existir antes de eliminarlo
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.destroy();
    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
};
