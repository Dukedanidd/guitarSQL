import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173", //cambiar el 3000 por 5173, preguntar a kaleb xd, que él le de pull por si truena y preguntarle por el .local del env
});

export default api;
