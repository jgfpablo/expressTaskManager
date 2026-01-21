import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import usersRouter from './routes/users.js';
import tasksRouter from './routes/tasks.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',authRouter);
app.use('/api',projectsRouter);
app.use('/api',usersRouter);
app.use('/api',tasksRouter);


app.listen(3000, () => console.log('Servidor Express corriendo en puerto 3000'));