import * as cursosModel from "../models/cursos.model.js";

 
/**
 * ==========================================
 * 📦 CONTROLADOR DE CURSOS
 * ==========================================
*/

 

export async function getCursos(req, res) {
  try {
    console.log('📦 Obteniendo cursos...');
   
    const cursos = await cursosModel.obtenerCursos();
   
    res.status(200).json({
      success: true,
      message: `Se encontraron ${cursos.length} cursos`,
      data: cursos
    });
   
  } catch (error) {
    console.error('❌ Error al obtener cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}