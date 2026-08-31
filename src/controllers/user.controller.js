import User from "../models/user.model.js";

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    if (name.length > 100 || email.length > 100 || password.length > 100) {
      return res.status(400).json({ error: "Los campos no pueden superar los 100 caracteres" });
    }

    // Verificar email único
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Validaciones básicas
    if (name && name.length > 100) {
      return res.status(400).json({ error: "El nombre no puede superar los 100 caracteres" });
    }
    if (email && email.length > 100) {
      return res.status(400).json({ error: "El email no puede superar los 100 caracteres" });
    }
    if (password && password.length > 100) {
      return res.status(400).json({ error: "La contraseña no puede superar los 100 caracteres" });
    }

    // Verificar email único si se va a cambiar
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
    }

    await user.update({ name, email, password });
    res.status(200).json({ message: "Usuario actualizado", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};