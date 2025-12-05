// 🌐 URL de nuestra API
const URL_API = "http://localhost:3000/api";

// ==============================================
// 🔧 FUNCIONES AUXILIARES PARA COMUNICACIÓN CON BACKEND
// ==============================================
function getAuthHeaders() {
    // Cabeceras base que siempre necesitamos para enviar JSON
    const headers = {
        'Content-Type': 'application/json'
    };

    // Si el usuario está autenticado, agregar token JWT
    if (estado.token) {
        // Formato estándar: "Bearer <token>"
        // Este es el formato que espera nuestro auth.middleware.js
        headers.Authorization = `Bearer ${estado.token}`;
    }

    return headers;
}

/**
 * 🔍 FUNCIÓN: estaLogueado()
 *   // Usamos !! para convertir a boolean explícitamente
        // null && null = null → !!null = false
        // objeto && string = string → !!string = true
 */
function estaLogueado() {
    return !!(estado.usuario && estado.token);
}

// ==============================================
// 📦 ARRANQUE BASICO DE LA APLICACIÓN MOSTRANDO PRODUCTOS DE API/PRODUCTOS
// ==============================================

// 📦 Función para cargar productos desde el backend
async function cargarProductos() {
    try {
        // 1. Hacemos petición GET a la API
        const respuesta = await fetch(`${URL_API}/productos`);

        // 2. Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // 3. Verificamos si la petición fue exitosa
        if (respuesta.ok) {
            estado.productos = datos.data || datos;
            mostrarProductos(datos.data);            
            console.log(`✅ ${estado.productos.length} productos cargados`);
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
    
    contenedor.innerHTML = lista.map(producto => `
          <div class="product-card">
            <img src="images/foto.png" class="product-image" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p class="product-price"><strong>€${producto.precio}</strong></p>
            <p class="product-stock">Stock: ${producto.stock}</p>  
    <div id="agregarbtn">
            <input type="number" id="cantidad-${producto.id}" min="1" max="${producto.stock}" value="1" class="cantidad-input">
            <button onclick="agregarAlCarrito(${producto.id}, parseInt(document.getElementById('cantidad-${producto.id}').value))"
                 class="btn btn-primary" 
                 ${producto.stock === 0 ? 'disabled' : ''}>
                 ${producto.stock === 0 ? '❌ Sin Stock' : '🛒 Agregar'}
            </button>
    </div>                    
            </div>           
            `).join('');    
}
// function mostrarbotones(lista) {
//     const contenedor = document.getElementById("productsGrid");
    
//     contenedor.innerHTML = lista.map(producto => `
//           <div class="product-card">
//             <img src="images/foto.png" class="product-image" alt="${producto.nombre}">
//             <h3>${producto.nombre}</h3>
//             <p>${producto.descripcion}</p>
//             <p class="product-price"><strong>€${producto.precio}</strong></p>
//             <p class="product-stock">Stock: ${producto.stock}</p>   
//             <input type="number" id="cantidad-${producto.id}" min="1" max="${producto.stock}" value="1" class="cantidad-input">
//              <button onclick="agregarAlCarrito(${producto.id}, parseInt(document.getElementById('cantidad-${producto.id}').value))"
//                   class="btn btn-primary" 
//                   ${producto.stock === 0 ? 'disabled' : ''}>
//                   ${producto.stock === 0 ? '❌ Sin Stock' : '🛒 Agregar'}
//              </button>                   
//             </div>
           
//             `).join('');
    
// }


// ==============================================
// 📦 ESTADO GLOBAL DE LA APLICACIÓN
// ==============================================

let estado = {
    usuario: null,   // { id, nombre, email }
    token: null,      // string con el JWT
    productos: [], // Origen: Respuesta del endpoint GET /api/productos
    carrito: []  // Flujo: Frontend → Backend cuando se crea pedido (POST /api/pedidos)
};
// ==============================================
// 🔐 AUTENTICACIÓN DE USUARIOS
// ==============================================

// 💾 Guardar sesión en memoria + localStorage
function guardarSesion(token, usuario) {
    estado.token = token;
    estado.usuario = usuario;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));

    console.log('💾 Sesión guardada para:', usuario.nombre);
}

// 🚪 Cerrar sesión
function cerrarSesion() {
    estado.token = null;
    estado.usuario = null;

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    console.log('👋 Sesión cerrada');
    mostrarInterfaz();
}

// ⏪ Cargar sesión si ya estaba guardada en el navegador
function cargarSesionGuardada() {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('user');

    if (tokenGuardado && usuarioGuardado) {
        try {
            estado.token = tokenGuardado;
            estado.usuario = JSON.parse(usuarioGuardado);
            console.log('👤 Sesión restaurada:', estado.usuario.nombre);
        } catch (err) {
            console.error('❌ Sesión corrupta, limpiando...', err);
            cerrarSesion();
        }
    }
}

// 🔑 LOGIN (email + password → token + usuario)
async function iniciarSesion(email, password) {
    try {
        const respuesta = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();
        console.log('📥 Respuesta login:', respuesta.status, datos);

        if (respuesta.ok) {
            guardarSesion(datos.token, datos.usuario);
            mostrarInterfaz();
            alert(`Bienvenido, ${datos.usuario.nombre}`);
        } else {
            alert(datos.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('❌ Error login:', error);
        alert('No se pudo conectar con el servidor');
    }
}

// 📝 REGISTRO (nombre + email + password → crea usuario y lo loguea)
async function registrarUsuario(nombre, email, password) {
    try {
        const respuesta = await fetch(`${URL_API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });

        const datos = await respuesta.json();
        console.log('📥 Respuesta registro:', respuesta.status, datos);

        if (respuesta.ok) {
            guardarSesion(datos.token, datos.usuario);
            mostrarInterfaz();
            alert(`Cuenta creada. Bienvenido, ${datos.usuario.nombre}`);
        } else {
            alert(datos.message || 'Error al registrarse');
        }
    } catch (error) {
        console.error('❌ Error registro:', error);
        alert('No se pudo conectar con el servidor');
    }
}

// Mostrar u ocultar secciones según si hay usuario o no
function mostrarInterfaz() {
    const authSection = document.getElementById('authSection');
    const authNav = document.getElementById('authNav'); // si lo tienes
    const authTienda = document.getElementById('tienda');
    const authBtts = document.getElementById('agregarbtn');

    const logged = !!estado.usuario;

    // Formulario login/registro
    if (authSection) {
        if (logged) {
            authSection.classList.add('hidden');
        } else {
            authSection.classList.remove('hidden');
        }
    }
    //Tienda
    if (authTienda) {
        if (logged) {
            authTienda.classList.remove('hidden');
        } else {            
            authTienda.classList.add('hidden');
        }
    }
    // Botones tienda
    if (authBtts) {
        if (logged) {
            authBtts.classList.remove('hidden');
        } else {           
            authBtts.classList.add('hidden');
        }
    }
    
    // Zona de navegación (opcional)
    if (authNav) {
        if (logged) {
            authNav.innerHTML = `
        <span class="user-name">👤 ${estado.usuario.nombre}</span>
        <button id="logoutButton" class="btn btn-outline">Cerrar sesión</button>
      `;
            document.getElementById('logoutButton')
                .addEventListener('click', cerrarSesion);
        } else {
            authNav.innerHTML = `<span>Inicia sesión para comprar</span>`;
        }
    }
    
  
}

// Conectar los formularios con las funciones de arriba
function configurarEventosLogin() {
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await iniciarSesion(email, password);
            loginForm.reset();
        });
    }

    // REGISTRO
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('registerNombre').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            await registrarUsuario(nombre, email, password);
            registerForm.reset();
        });
    }

    // Cambiar de login → registro
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        });
    }

    // Cambiar de registro → login
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        });
    }
}

// 🚀 Cuando la página termine de cargar, ejecutamos la función
document.addEventListener("DOMContentLoaded", async function () {
    console.log('🚀 ¡Iniciando Bazar Online!');
    try {
        await cargarProductos();
        cargarSesionGuardada();   // opcional, pero bonito para recordar al usuario
        configurarEventosLogin();        
        mostrarInterfaz();
        
        console.log('✅ ¡Todo listo! La aplicación está funcionando correctamente.');
    } catch (error) {
        // 🚨 Si algo sale mal, mostrar un mensaje de error al usuario
        console.error('❌ Error durante la inicialización:', error);
        mostrarAlerta('Error de Conexión', 'No se pudo conectar con el servidor. ¿Está funcionando el backend?');
    }
});




// ==============================================
// 🛒 SISTEMA DE CARRITO DE COMPRAS
// ==============================================
/**
 * 🛍️ FUNCIÓN: agregarAlCarrito(productoId, cantidad)
 */
function agregarAlCarrito(productoId, cantidad = 1) {
  // 🔒 CAPA 1: VERIFICACIÓN DE AUTENTICACIÓN
  if (!estaLogueado()) {      
    alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
    return; // Termina la función inmediatamente (early return)
  }
  // 🔍 CAPA 2: VERIFICACIÓN DE DATOS
   const producto = estado.productos.find(p => p.id === productoId); 
  if (!producto) {
    alert('❌ Producto no encontrado');
    return;
  }
  // ✅ CAPA 3: VERIFICACIÓN DE STOCK
  if (producto.stock < cantidad) {
    alert(`❌ Solo hay ${producto.stock} unidades disponibles`);
    return;
  }
  // 🔍 CAPA 4: VERIFICACIÓN DE DUPLICADOS
  const productoEnCarrito = estado.carrito.find(item => item.id === productoId);
  
  if (productoEnCarrito) {
      // 📈 ESCENARIO: PRODUCTO YA EN CARRITO
    const nuevaCantidad = productoEnCarrito.cantidad + cantidad;
    
    if (nuevaCantidad > producto.stock) {
      alert(`❌ No hay suficiente stock. Máximo: ${producto.stock}`);
      return;
    }
    } else {
      // ➕ ESCENARIO: PRODUCTO NUEVO EN CARRITO
      estado.carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      stock: producto.stock
    });
    console.log(`➕ Producto agregado al carrito: ${producto.nombre} x${cantidad}`);
  }
  // 🎨 CAPA 5: ACTUALIZACIÓN DE INTERFAZ
  mostrarCarrito();
  actualizarBotonCarrito();
}

/** ==========================================
  * Quitar del carrito 
    ========================================== */
    function quitarDelCarrito(productoId) {
  // Buscar posición del producto en el carrito
  const index = estado.carrito.findIndex(item => item.id === productoId);
  
  if (index !== -1) {
    // Guardar referencia para logging antes de eliminar
    const producto = estado.carrito[index];
    console.log(`🗑️ Producto quitado del carrito: ${producto.nombre}`);
    
    // splice(posición, cantidad) elimina elementos del array
    estado.carrito.splice(index, 1);
    
    // Actualizar interfaz para mostrar cambios
    mostrarCarrito();
    actualizarBotonCarrito();
  }
}
/**
 * ⚖️ FUNCIÓN: cambiarCantidad(productoId, nuevaCantidad)
 */ 
function cambiarCantidad(productoId, nuevaCantidad) {
  // Si cantidad es menor a 1, eliminar producto completamente
  if (nuevaCantidad < 1) {
    quitarDelCarrito(productoId);
    return;
  }
  
  // Buscar producto en carrito
  const productoEnCarrito = estado.carrito.find(item => item.id === productoId);
  if (productoEnCarrito) {
    // Verificar que no exceda stock disponible
    if (nuevaCantidad > productoEnCarrito.stock) {
      alert(`❌ Stock máximo: ${productoEnCarrito.stock}`);
      return;
    }
    
    // Actualizar cantidad y refrescar interfaz
    productoEnCarrito.cantidad = nuevaCantidad;
    mostrarCarrito();
    actualizarBotonCarrito();
  }
}
/**
 * 💰 FUNCIÓN: calcularTotal()
 */
function calcularTotal() {
  return estado.carrito.reduce((total, item) => {
    return total + (item.precio * item.cantidad);
  }, 0); // 0 es el valor inicial del acumulador
}
/**
 * 🧹 FUNCIÓN: vaciarCarrito()
 */
function vaciarCarrito() {
  estado.carrito = [];
  mostrarCarrito();
  actualizarBotonCarrito();
  console.log('🗑️ Carrito vaciado');
}


/** ==========================================
  * Mostrar carrito en el HTML
    ========================================== */
function mostrarCarrito() {
  const carritoVacio = document.getElementById('carritoVacio');
  const carritoProductos = document.getElementById('carritoProductos');
  const carritoTotal = document.getElementById('carritoTotal');
  const totalAmount = document.getElementById('totalAmount');
  
  if (estado.carrito.length === 0) {
    // Carrito vacío
    carritoVacio.classList.remove('hidden');
    carritoProductos.classList.add('hidden');
    carritoTotal.classList.add('hidden');
  } else {
    // Carrito con productos
    carritoVacio.classList.add('hidden');
    carritoProductos.classList.remove('hidden');
    carritoTotal.classList.remove('hidden');
    
    // Generar HTML de productos en carrito
    carritoProductos.innerHTML = estado.carrito.map(item => `
      <div class="carrito-item">
        <div class="item-info">
          <h4>${item.nombre}</h4>
          <p class="item-price">€${item.precio} c/u</p>
        </div>
        <div class="item-controls">
          <button onclick="cambiarCantidad(${item.id}, ${item.cantidad - 1})" class="btn btn-small">-</button>
          <span class="item-quantity">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, ${item.cantidad + 1})" class="btn btn-small">+</button>
          <button onclick="quitarDelCarrito(${item.id})" class="btn btn-danger btn-small">🗑️</button>
        </div>
        <div class="item-total">
          €${(item.precio * item.cantidad).toFixed(2)}
        </div>
      </div>
    `).join('');
    
    // Actualizar total
    totalAmount.textContent = `€${calcularTotal().toFixed(2)}`;
  }
}

/** ==========================================
  * Mostrar PEDIDOS en el HTML
    ========================================== */
function mostrarPedidos(pedidos) {
  const pedidosVacio = document.getElementById('pedidosVacio');
  const pedidosList = document.getElementById('pedidosList');
  
  if (!pedidos || pedidos.length === 0) {
    pedidosVacio.classList.remove('hidden');
    pedidosList.classList.add('hidden');
  } else {
    pedidosVacio.classList.add('hidden');
    pedidosList.classList.remove('hidden');
    
    pedidosList.innerHTML = pedidos.map(pedido => {
      const totalPedido = pedido.productos.reduce((total, prod) => {
        return total + (prod.producto_precio * prod.cantidad);
      }, 0);
      
      return `
        <div class="pedido-card">
          <div class="pedido-header">
            <h4>Pedido #${pedido.id}</h4>
            <span class="pedido-estado estado-${pedido.estado}">${pedido.estado}</span>
          </div>
          <div class="pedido-info">
            <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString()}</p>
            <p><strong>Total:</strong> €${totalPedido.toFixed(2)}</p>
          </div>
          <div class="pedido-productos">
            <h5>Productos:</h5>
            ${pedido.productos.map(prod => `
              <div class="pedido-producto">
                <span>${prod.producto_nombre}</span>
                <span>x${prod.cantidad}</span>
                <span>€${(prod.producto_precio * prod.cantidad).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }
}
