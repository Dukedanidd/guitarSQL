import * as dotenv from 'dotenv';

// Debe ser lo primero que se ejecute
dotenv.config();

// Resto de imports
import express, { Request, Response } from "express";
import mysql, { QueryResult } from "mysql2";
import cors from "cors";
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.EXPRESS_PORT;

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
  db.query("SELECT * FROM guitarla.guitarras", (err, results) => {
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

// ENDPOINT PARA REGISTRAR USUARIOS
app.post("/register", (req: Request, res: Response) => {
  const { email, contraseña, nombre, apellido, dirección, teléfono } = req.body;

  // Validar los datos recibidos
  if (!email || !contraseña || !nombre || !apellido) {
    return res.status(400).json({
      error: "Faltan datos obligatorios: email, contraseña, nombre y apellido son requeridos.",
    });
  }

  // Encriptar la contraseña antes de almacenarla (por seguridad)
  const saltRounds = 10;

  bcrypt.hash(contraseña, saltRounds, (err: Error | null, hash: string) => {
    if (err) {
      console.error("Error al encriptar la contraseña:", err);
      return res.status(500).json({
        error: "Error al procesar la contraseña",
      });
    }

    // Insertar el nuevo usuario en la base de datos
    const sqlQuery = `
      INSERT INTO usuarios (email, contraseña, nombre, apellido, dirección, teléfono)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [email, hash, nombre, apellido, dirección || null, teléfono || null];

    db.query(sqlQuery, values, (dbErr, results) => {
      if (dbErr) {
        // Manejar errores comunes como email duplicado
        if (dbErr.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            error: "El email ya está registrado.",
          });
        }
        console.error("Error al registrar usuario:", dbErr);
        return res.status(500).json({
          error: "Error al registrar el usuario",
          details: dbErr.message,
        });
      } else {
        const userId = results.insertId;
        console.log("Usuario registrado con ID:", userId);
        res.status(201).json({
          message: "Usuario registrado con éxito.",
          userId: userId,
        });
      }
    });
  });
});


// app.get(/carrito) necesita los items del carrito del usuario

// app.post(/agregar-a-carrito) agrega un item al carrito del usuario que inicio sesion
// app.delete(/borrar-del-carrito)



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
