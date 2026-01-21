
import { pool } from '../db.js';

// import db from '../db'; // tu conexión a Postgres


export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // viene del token JWT en el middleware

    const result = await pool.query(
      `INSERT INTO projects (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, userId]
    );

    // También registrar al creador como miembro con rol "admin"
    await pool.query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
      [result.rows[0].id, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await pool.query(
      `SELECT p.*
       FROM projects p
       JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};


export const getProjectById = async (req, res) => {
  try {
  const { id } = req.params;
  const userId = req.user.id; // si lo necesitás para validar

  const result = await pool.query(
    `SELECT p.*, json_agg(pm.*) AS members
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id
WHERE p.id = $1
GROUP BY p.id`, [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Proyecto no encontrado' });
  }
  res.json(result.rows);
} catch (err) {
  console.error('Error al obtener proyecto:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
};

export const addMemberToProject = async (req, res) => {
  try {
    
    const { projectId,email,role } = req.body;

    // Verificar que el proyecto exista
    const project = await pool.query(
      `SELECT id FROM projects WHERE id = $1`,
      [projectId]
    );
    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Buscar usuario por correo
    const user = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userId = user.rows[0].id;

    // Insertar miembro en el proyecto
    await pool.query(
      `INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, $3)`,
      [projectId, userId, role]
    );

    res.status(201).json({ message: 'Miembro agregado al proyecto' });
  } catch (err) {
    console.error('Error en addMemberToProject:', err);
    res.status(500).json({ error: 'Error al agregar miembro al proyecto' });
  }
};

export const removeMemberFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Ejecutar DELETE
    const result = await pool.query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *',
      [projectId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Miembro no encontrado en el proyecto' });
    }

    return res.json({ message: 'Miembro eliminado correctamente', member: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar miembro del proyecto:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
