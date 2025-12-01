// 🌐 URL de nuestra API
const URL_API = "http://localhost:3000/api";

// 📦 Función para cargar productos desde el backend
async function cargarProductos() {
    try {
        // 1. Hacemos petición GET a la API
        const respuesta = await fetch(`${URL_API}/productos`);
        
        // 2. Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // 3. Verificamos si la petición fue exitosa
        if (respuesta.ok) {
            mostrarProductos(datos.data);
        } else {
            console.error("Error al cargar productos");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
}

// 🎨 Función para mostrar los productos en la página
function mostrarProductos(lista) {
    const contenedor = document.getElementById("productsGrid");

    // Creamos el HTML para cada producto
    contenedor.innerHTML = lista.map(producto => `
        <div class="product-card">
            <img src="images/foto.png" class="product-image" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>${producto.precio}€</strong></p>
            <p>Stock: ${producto.stock}</p>
        </div>
    `).join('');
}

// 🚀 Cuando la página termine de cargar, ejecutamos la función
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});