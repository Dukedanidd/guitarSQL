import * as dotenv from 'dotenv';

// Debe ser lo primero que se ejecute
dotenv.config();

// Resto de imports
import express, { Request, Response } from "express";
import mysql, { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import cors from "cors";

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

    // Consulta SQL para insertar el nuevo usuario
    const sqlQuery = `
      INSERT INTO usuarios (email, contraseña, nombre, apellido, dirección, teléfono)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [email, contraseña, nombre, apellido, dirección, teléfono];

    db.query(sqlQuery, values, (err, results: ResultSetHeader) => {
        if (err) {
            console.error("Error al registrar usuario:", err);
            return res.status(500).json({
                error: "Error al registrar el usuario",
                details: err.message
            });
        }
        const userId = results.insertId;
        console.log("Usuario registrado con ID:", userId);
        res.status(201).json({
          message: "Usuario registrado con éxito.",
          userId: userId,
        });
    });
});

// ENDPOINT PARA INICIAR SESIÓN
app.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Consulta SQL para buscar el usuario por email
    const sqlQuery = `SELECT * FROM usuarios WHERE email = ?`;

    db.query(sqlQuery, [email], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error("Error al buscar usuario:", err);
            return res.status(500).json({
                error: "Error en el servidor",
                details: err.message
            });
        }

        // Verificar si hay resultados
        if (results.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const user = results[0];
        console.log("eñ user is=>",user)

        // Comparar la contraseña proporcionada con la almacenada (sin encriptación)
        if (user.contraseña !== password) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Si todo es correcto, imprimir en consola y devolver un mensaje de éxito
        console.log(`Inicio de sesión exitoso para el usuario: ${user.email}, ID: ${user.id}`);
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            userId: user.id_usuario,
            nombre: user.nombre
        });
    });
});

// app.get(/carrito) necesita los items del carrito del usuario

// app.post(/agregar-a-carrito) agrega un item al carrito del usuario que inicio sesion
// app.delete(/borrar-del-carrito)

// Endpoint para insertar datos en items_carrito
app.post("/insert-cart", (req:any, res:any) => {
  const { id_carrito, items } = req.body; // Extraer datos del cuerpo de la solicitud

  if (!id_carrito || !items || !Array.isArray(items)) {
    return res.status(400).json({
      error: "Faltan datos requeridos o formato incorrecto",
    });
  }

  // Convertir los datos de items a JSON para MySQL
  const itemsJSON = JSON.stringify(items);

  // Ejecutar el procedimiento almacenado
  db.query(
    "CALL InsertItemsCarrito(?, ?)",
    [id_carrito, itemsJSON],
    (err, results) => {
      if (err) {
        console.error("Error al ejecutar el procedimiento almacenado:", err);
        return res.status(500).json({
          error: "Error en el servidor",
          details: err.message,
        });
      }

      console.log("Inserción completada:", results); // Para depuración
      res.status(200).json({
        message: "Carrito insertado correctamente",
        results,
      });
    }
  );
});

app.post("/insert-new-cart", (req:any, res:any) => {
  const { id_usuario } = req.body;

  if (!id_usuario) {
    return res.status(400).json({
      error: "El campo 'id_usuario' es requerido.",
    });
  }

  // Consulta SQL para insertar un nuevo carrito
  const query = `INSERT INTO carrito (id_usuario, estado) VALUES (?, 'activo')`;

  // Ejecutar la consulta
  db.query(query, [id_usuario], (err, results:any) => {
    if (err) {
      console.error("Error al crear el carrito:", err);
      return res.status(500).json({
        error: "Error en el servidor al crear el carrito.",
        details: err.message,
      });
    }
    const id_carrito = results?.insertId;

    console.log("ID del carrito recién creado:", id_carrito);

    // Devolver el ID del carrito recién creado
    res.json({
      success: true,
      message: "Carrito creado exitosamente.",
      id_carrito: id_carrito,
    });
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
