
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