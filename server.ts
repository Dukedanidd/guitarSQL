import * as dotenv from 'dotenv';

// Debe ser lo primero que se ejecute
dotenv.config();

// Resto de imports
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;

// Agregar middleware de CORS
app.use(cors());
app.use(express.json());

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// Agregar un console.log para debug
console.log('Configuración DB:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
  // No imprimas la contraseña por seguridad
});

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
    return;
  }
  console.log("Conexión exitosa a la base de datos.");
});

// Endpoint básico para probar
app.get("/", (req, res) => {
  res.send("Servidor funcionando.");
});

// Agregar el nuevo endpoint para obtener datos
app.get("/data", (req, res) => {
  db.query("SELECT * FROM items_carrito", (err, results) => {
    if (err) {
      console.error("Error al ejecutar consulta:", err);
      res.status(500).json({
        error: "Error en el servidor",
        details: err.message
      });
      return;
    }
    console.log("Datos recuperados:", results); // Para debug
    res.json(results);
  });
});

// Endpoint de prueba para verificar la conexión
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error de conexión a la base de datos" });
      return;
    }
    res.json({ message: "Conexión exitosa a la base de datos" });
  });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
