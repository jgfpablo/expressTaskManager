import { pool } from '../db.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;
    const projectId = req.params.id; // viene de la URL /projects/:id/tasks
    const userId = req.user.id; // del JWT
    console.log('Datos recibidos en el body:', req.body);

    if (!title) {
      return res.status(400).json({ error: 'title es obligatorio' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, due_date, project_id, created_by,priority_id,status_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, dueDate, projectId, userId, priority, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando tarea:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         t.id,
         t.title,
         t.description,
         ts.name AS status_name,
         tp.name AS priority_name,
         t.created_at,
         t.updated_at
       FROM tasks t
       LEFT JOIN task_status ts ON t.status_id = ts.id
       LEFT JOIN task_priority tp ON t.priority_id = tp.id`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error obteniendo tareas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const getAllTaskPriority = async (req, res) => {
try{
    const result = await pool.query(
      `SELECT * FROM task_priority `
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error obteniendo prioridades:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllStatus = async (req, res) => {
try{
    const result = await pool.query(
      `SELECT * FROM task_status `
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error obteniendo prioridades:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};