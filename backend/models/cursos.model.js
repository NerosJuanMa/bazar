import pool2 from "../config/db2.js";

export async function obtenerCursos() {
    const [rows] = await pool2.query(
    `SELECT c.id_curso, c.id_especialidad, c.nombre_curso, c.fecha_realizacion, c.FechaCalculadaAño, c.practicas, c.id_practicas, c.duracion_curso, c.conocimientos_adquiridos, c.Centro_Estudio, e.nombre, e.familia, e.aplicaciones 
     FROM cursos.cursos c 
     JOIN cursos.especialidad e
     ON c.id_especialidad= e.id_especialidad
     ORDER BY c.id_curso DESC`
  );
  return rows;
}