import * as likesModel from "../models/likes.model.js";


export async function getlikes(req, res) {
  try {
    console.log('📦 Obteniendo likes...');
   
    const likes = await likesModel.obtenerlikes();
   
    res.status(200).json({
      success: true,
      message: `Se encontraron ${likes.length} likes`,
      data: likes
    });
   
  } catch (error) {
    console.error('❌ Error al obtener likes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}

export async function sendCountlikes(req, res) {
  try {
    console.log('📦 Obteniendo likes...');
   
    const likes = await likesModel.sendCount();
   
    res.status(200).json({
      success: true,
      message: `Se encontraron ${likes} likes`,
      data: likes
    });
   
  } catch (error) {
    console.error('❌ Error al obtener likes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}



// likeModel.query(likedQuery, [pageId, userIp], (err, likedResult) => {
//     if (err) return res.sendStatus(500);

//     const liked = likedResult.length > 0;

//     likeModel.query(countQuery, [pageId], (err, countResult) => {
//       if (err) return res.sendStatus(500);

//       res.json({
//         liked,
//         total: countResult[0].total
//       });
//     });
//   });
