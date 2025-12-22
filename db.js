import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

 export const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
  //  ssl: { rejectUnauthorized: false }  quitar ssl para conexion local
  ssl: false
 });
