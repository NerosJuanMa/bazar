

/**
 * ==========================================
 * 🛒 TIENDA ONLINE - MANUAL DIDÁCTICO
 * ==========================================
 * 
 * Este archivo contiene toda la lógica del frontend de una tienda online.
 * Está organizado en secciones para facilitar el aprendizaje:
 * 
 * 1. 🔧 CONFIGURACIÓN - Variables globales
 * 2. 📦 PRODUCTOS PÚBLICOS - Visualización sin login
 * 3. 🔐 AUTENTICACIÓN - Login y registro
 * 4. 🎛 INTERFAZ - Mostrar/ocultar secciones
 * 5. 🛒 CARRITO - Gestión del carrito de compras
 * 6. 🏪 TIENDA PRIVADA - Productos con botón comprar
 * 7. ✅ PEDIDOS - Finalizar compras
 * 8. 🚀 ARRANQUE - Inicialización de la app
 */

// =============================
// 🔧 CONFIGURACIÓN Y ESTADO
// =============================

/**
 * URL_API: Dirección del backend donde están nuestras APIs
 * Cambiar solo el puerto si tu servidor corre en otro puerto
 */
const URL_API = "http://localhost:3000/api";

/**
 * ESTADO GLOBAL: Toda la información importante de la app
 * Es como la "memoria" de nuestra aplicación
 * 
 * - usuario: Datos del usuario logueado (null = no hay usuario)
 * - token: Clave secreta para comunicarse con el backend
 * - carrito: Lista de productos que el usuario quiere comprar
 */
let estado = {
  usuario: null,    // 👤 {id: 1, nombre: "Juan", email: "juan@email.com"}
  token: null,      // 🔑 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  carrito: {        // 🛒 {items: [{id:1, nombre:"Producto", precio:10, cantidad:2}], total: 20}
    items: [],
    total: 0
  }
};

//generar fecha actual
// Obtener la fecha y hora actual
        const fecha = new Date();

        // Obtener el elemento span por su ID
       
        const contenedorFechah = document.getElementById('fechaActualh');
        // Formatear la fecha para mostrarla según la configuración local del usuario
        // 'es-ES' especifica el formato para España, puedes cambiarlo si necesitas otro.
        // Las opciones { dateStyle: 'full' } dan un formato completo (ej: lunes, 10 de noviembre de 2025)
        const fechaFormateada = fecha.toLocaleDateString('es-ES', { dateStyle: 'full' });

        // Insertar la fecha formateada en el elemento HTML
      
        contenedorFechah.textContent = fechaFormateada;

//LIKE CORAZONES//

// const pageId = 'mi_pagina_unica';
// const btn_like = document.getElementById('likeBtn');
// const count = document.getElementById('likeCount');

// Estado inicial
// fetch(`http://localhost:3000/status?page_id=${pageId}`)
//   .then(res => res.json())
//   .then(data => {
//     count.textContent = data.total;
//     if (data.liked) btn_like.classList.add('liked');
//   });

// btn_like.addEventListener('click', () => {
//   fetch('http://localhost:3000/like', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ page_id: pageId })
//   })
//   .then(res => res.json())
//   .then(data => {
//     count.textContent = data.total;
//     btn_like.classList.toggle('liked', data.liked);
//     pop();
//     if (data.liked) hearts();
//   });
// });

// function pop() {
//   btn_like.classList.add('pop');
//   setTimeout(() => btn_like.classList.remove('pop'), 200);
// }

// function hearts() {
//   for (let i = 0; i < 6; i++) {
//     const h = document.createElement('div');
//     h.className = 'heart';
//     h.textContent = '❤️';
//     const r = btn_like.getBoundingClientRect();
//     h.style.left = (r.left + Math.random() * r.width) + 'px';
//     h.style.top = r.top + 'px';
//     document.body.appendChild(h);
//     setTimeout(() => h.remove(), 1000);
//   }
// }



// =============================
// 📦 PRODUCTOS PÚBLICOS
// (Cualquier persona puede verlos, SIN botón comprar)
// =============================

/**
 * verJSON() - Muestra los datos raw del backend; es una funcion de comprobación. Aquí decimos ok mi backend funciona 
 * y se conecta con mi front. Puedo seguir. 
 * 
 * ¿Para qué sirve?
 * - Debugging: Ver exactamente qué datos envía el servidor
 * 
 * 
 * ¿Cómo funciona?
 * 1. Hace una petición GET a /api/productos. 
 * 2. Convierte la respuesta a JSON
 * 3. La muestra en el elemento <pre id="listaProductos">
 */
async function verJSON() {
  try {
    // fetch() = "Ve y trae los datos de esta URL"
    const respuesta = await fetch(`${URL_API}/productos`);
    const datos = await respuesta.json();
    
    // Mostrar los datos en formato JSON legible
    const salida = document.getElementById("listaProductos");
    if (salida) {
      salida.textContent = JSON.stringify(datos, null, 2); // null, 2 = formato bonito
    }
  } catch (error) {
    // Si algo sale mal (internet, servidor caído, etc.)
    console.error("Error al obtener JSON:", error);
  }
}

/**
 * cargarProductos() - Carga y muestra productos en formato de tarjetas
 * 
 * ¿Cuándo se ejecuta?
 * - Al cargar la página (siempre visible)
 * - Para usuarios NO logueados (vista pública)
 * 
 * ¿Qué hace?
 * 1. Pide productos al backend
 * 2. Si todo va bien, llama a mostrarProductos()
 * 3. Si hay error, lo registra en consola
 */
async function cargarProductos() {
  try {
    const respuesta = await fetch(`${URL_API}/productos`);
    const datos = await respuesta.json();

    // Verificar que la petición fue exitosa Y que hay datos
    if (respuesta.ok && datos.data) {
      mostrarProductos(datos.data); // datos.data = array de productos
    } else {
      console.error("Error al cargar productos");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

/**
 * mostrarProductos() - Convierte array de productos en HTML
 * 
 * @param {Array} lista - Array de productos del backend
 * Ejemplo: [{id:1, nombre:"Camiseta", precio:20, stock:5}, ...]
 * 
 * ¿Qué hace?
 * 1. Busca el contenedor <div id="productos">
 * 2. Convierte cada producto en una tarjeta HTML
 * 3. Usa .map() para transformar array → HTML
 * 4. Usa .join() para unir todo en un string
 */
function mostrarProductos(lista) {
  const contenedor = document.getElementById("productos");
  if (!contenedor) return; // Si no existe el elemento, salir

  // .map() = "Por cada producto, crear este HTML"
  contenedor.innerHTML = lista.map(producto => `
    <div class="product-card">
      <img src="./images/foto.png" class="product-image" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion || ""}</p>
      <p><strong>${producto.precio}€</strong></p>
      <p>Stock: ${producto.stock}</p>
    </div>
  `).join(""); // .join("") = unir todo sin separadores
}

// =============================
// 🔐 SESIÓN: LOGIN / REGISTRO
// =============================

/**
 * guardarSesion() - Guarda datos del usuario logueado
 * 
 * @param {string} token - JWT token del backend
 * @param {Object} usuario - Datos del usuario {id, nombre, email}
 * 
 * ¿Qué hace?
 * 1. Guarda en memoria (variable estado)
 * 2. Guarda en localStorage (persistencia entre recargas)
 * 3. Registra en consola para debugging
 * 
 * ¿Por qué localStorage?
 * - Para que el usuario siga logueado al recargar la página
 * - Se mantiene hasta que cierre el navegador o borre datos
 */
function guardarSesion(token, usuario) {
  // Guardar en memoria (desaparece al recargar)
  estado.token = token;
  estado.usuario = usuario;

  // Guardar en localStorage (persiste al recargar)
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(usuario)); // JSON.stringify = objeto → texto

  console.log("💾 Sesión guardada para:", usuario.nombre);
}

/**
 * cerrarSesion() - Limpia toda la información del usuario
 * 
 * ¿Cuándo se ejecuta?
 * - Cuando el usuario hace click en "Cerrar sesión"
 * - Cuando hay un error de sesión corrupta
 * 
 * ¿Qué limpia?
 * - Estado en memoria
 * - localStorage
 * - Carrito de compras
 */
function cerrarSesion() {
  // Limpiar memoria
  estado.token = null;
  estado.usuario = null;
  estado.carrito = { items: [], total: 0 };

  // Limpiar localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("carrito");

  console.log("👋 Sesión cerrada");
  mostrarInterfaz(); // Actualizar la interfaz
}

/**
 * cargarSesionGuardada() - Restaura sesión al recargar página
 * 
 * ¿Cuándo se ejecuta?
 * - Al cargar la página
 * 
 * ¿Qué hace?
 * 1. Busca token y usuario en localStorage
 * 2. Si existen, los restaura en memoria
 * 3. Si hay error (datos corruptos), cierra sesión
 */
function cargarSesionGuardada() {
  const tokenGuardado = localStorage.getItem("token");
  const usuarioGuardado = localStorage.getItem("user");

  // Solo restaurar si AMBOS existen
  if (tokenGuardado && usuarioGuardado) {
    try {
      estado.token = tokenGuardado;
      estado.usuario = JSON.parse(usuarioGuardado); // JSON.parse = texto → objeto
      console.log("👤 Sesión restaurada:", estado.usuario.nombre);
    } catch (err) {
      // Si JSON.parse falla (datos corruptos)
      console.error("❌ Sesión corrupta, limpiando...", err);
      cerrarSesion();
    }
  }
}

/**
 * iniciarSesion() - Autentica usuario con email/password
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * 
 * ¿Cómo funciona?
 * 1. Envía POST a /api/auth/login con credenciales
 * 2. Si es correcto, guarda sesión y actualiza interfaz
 * 3. Si es incorrecto, muestra error al usuario
 */
async function iniciarSesion(email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }) // Convertir objeto a JSON
    });

    const datos = await respuesta.json();
    console.log("📥 Respuesta login:", respuesta.status, datos);

    if (respuesta.ok) {
      // ✅ Login exitoso
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Bienvenido, ${datos.usuario.nombre}`);
    } else {
      // ❌ Credenciales incorrectas
      alert(datos.message || "Error al iniciar sesión");
    }
  } catch (error) {
    // ❌ Error de conexión (servidor caído, sin internet, etc.)
    console.error("❌ Error login:", error);
    alert("No se pudo conectar con el servidor");
  }
}

/**
 * registrarUsuario() - Crea cuenta nueva y loguea automáticamente
 * 
 * @param {string} nombre - Nombre completo
 * @param {string} email - Email único
 * @param {string} password - Contraseña
 * 
 * ¿Qué hace?
 * 1. Envía datos a /api/auth/register
 * 2. El backend crea la cuenta Y devuelve token
 * 3. Automáticamente loguea al usuario
 */
async function registrarUsuario(nombre, email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    });

    const datos = await respuesta.json();
    console.log("📥 Respuesta registro:", respuesta.status, datos);

    if (respuesta.ok) {
      // ✅ Registro exitoso + auto-login
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Cuenta creada. Bienvenido, ${datos.usuario.nombre}`);
    } else {
      // ❌ Error: email ya existe, datos inválidos, etc.
      alert(datos.message || "Error al registrarse");
    }
  } catch (error) {
    console.error("❌ Error registro:", error);
    alert("No se pudo conectar con el servidor");
  }
}

// =============================
// 🎛 INTERFAZ DE USUARIO. 
// (Mostrar/ocultar secciones según si el usuario esta logado o no: muestra los productos para comprar)
//Aqui ya hemos introducido cambios para mostrar una interfaz diferente cuando el usuario se loga
// =============================

/**
 * mostrarInterfaz() - El "director" de nuestro index
 * 
 * ¿Cuándo se ejecuta?
 * - Al cargar la página
 * - Después de login/logout
 * - Después de registro
 * 
 * ¿Qué hace?
 * - Decide qué mostrar según si hay usuario logueado
 * - Usuario NO logueado: formularios login/registro y productos como catalogo
 * - Usuario SÍ logueado: tienda privada + navegación
 */
function mostrarInterfaz() {
  // Buscar elementos del DOM
  const authSection   = document.getElementById("authSection");   // Formularios login/registro
  const authNav       = document.getElementById("authNav");       // Barra superior
  const tiendaSection = document.getElementById("tiendaSection"); // Tienda para usuarios logados 
  const productosMostrar   = document.getElementById("productosMostrar"); // Muestra productos para usuarios NO logados 
  
  const logueado = !!estado.usuario; // nace como null que es false pero no un boolean aqui lo que hace es convertirlo en un boolean

  // 📝 FORMULARIOS LOGIN/REGISTRO
  // Mostrar solo si NO está logueado
  if (authSection) {
    authSection.classList.toggle("hidden", logueado); // toggle = añadir/quitar clase
  }
  if (productosMostrar) {
        productosMostrar.classList.toggle("hidden", logueado);}

  // 🏪 TIENDA para usuarios logados sólo se mostrara si esta logged
  //hidden está definido en style y es una propiedad del contenedor
  if (tiendaSection) {
    tiendaSection.classList.toggle("hidden", !logueado); // !logged = no logado 
    //toggle es un método de classList que añade o quita una clase CSS a un elemento del DOM.
    //con dos parametros significa ejecuta ese estilo segun la condicion


    if (logueado) {
      // Si está logueado, cargar datos de la tienda
      cargarCarrito();        // Restaurar carrito desde localStorage
      cargarProductosTienda(); // Mostrar productos con botón "Comprar"
      
    }
  }

  // 🧭 NAVEGACIÓN SUPERIOR
  if (authNav) {
    if (logueado) {
      // Usuario logueado: mostrar nombre + botón salir
      authNav.innerHTML = `
        <span class="user-name">👤 ${estado.usuario.nombre}</span>
        <button id="logoutButton" class="btn btn-outline">Cerrar sesión</button>
      `;
      // Conectar el botón con la función
      document
        .getElementById("logoutButton")
        .addEventListener("click", cerrarSesion);
    } else {
      // Usuario NO logueado: mensaje informativo
      authNav.innerHTML = `<span>Inicia sesión para comprar</span>`;
       

    }
  }
}

/**
 * configurarEventosLogin() - Conecta formularios HTML con funciones JS
 * 
 * ¿Por qué esta función?
 * - Separar la lógica de los eventos del resto del código
 * - Hacer el código más organizado y legible
 * - Evitar repetir código de eventos
 * 
 * ¿Qué conecta?
 * - Formulario login → iniciarSesion()
 * - Formulario registro → registrarUsuario()
 * - Links "Regístrate" / "Inicia sesión" → cambiar formularios
 */
function configurarEventosLogin() {
  // Buscar elementos del DOM
  const loginForm    = document.getElementById("loginFormElement");
  const registerForm = document.getElementById("registerFormElement");
  const showRegister = document.getElementById("showRegister");
  const showLogin    = document.getElementById("showLogin");

  // 📝 FORMULARIO DE LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Evitar que recargue la página
      
      // Obtener valores de los inputs
      const email    = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      
      await iniciarSesion(email, password);
      loginForm.reset(); // Limpiar formulario
    });
  }

  // 📝 FORMULARIO DE REGISTRO
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const nombre   = document.getElementById("registerNombre").value;
      const email    = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      
      await registrarUsuario(nombre, email, password);
      registerForm.reset();
    });
  }

  // 🔗 LINK "REGÍSTRATE AQUÍ"
  if (showRegister) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar que navegue
      
      // Ocultar login, mostrar registro
      document.getElementById("loginForm").classList.add("hidden");
      document.getElementById("registerForm").classList.remove("hidden");
    });
  }

  // 🔗 LINK "INICIA SESIÓN AQUÍ"
  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Ocultar registro, mostrar login
      document.getElementById("registerForm").classList.add("hidden");
      document.getElementById("loginForm").classList.remove("hidden");
    });
  }
}


// =============================
// 🏪 PRODUCTOS PARA EL CONTENEDOR PARA COMPRAR QUE SE ABRE CUANDO EL USUARIO SE LOGA 
// (CON botón de comprar - solo usuarios logueados)
// =============================

/**
 * cargarProductosTienda() - Carga productos para usuarios logueados
 * 
 * ¿Diferencia con cargarProductos()?
 * - cargarProductos() = vista pública (SIN botón comprar)
 * - cargarProductosTienda() = vista privada (CON botón comprar)
 * 
 * ¿Misma API?
 * - Sí, usa la misma API /api/productos
 * - Pero muestra diferente HTML (con botones)
 * /**
 * obtenerProductos() → Pide productos al backend y devuelve la lista
 */
async function obtenerProductos() {
  try {
    const respuesta = await fetch(`${URL_API}/productos`);
    const datos = await respuesta.json();

    if (respuesta.ok && datos.data) {
      return datos.data; // ← devolvemos la lista
    } else {
      console.error("Error al cargar productos");
      return []; // devuelvo lista vacía para evitar errores
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    return []; // evitamos que la app se rompa
  }
}

 
async function cargarProductosTienda() {
  const lista = await obtenerProductos(); 
  mostrarProductosTienda(lista); 
}


/**
 * mostrarProductosTienda() - Muestra productos que ya teniamos y le agrega el  botón "Agregar al carrito"
 * 
 * @param {Array} lista - Array de productos
 * 
 * ¿Diferencias con mostrarProductos()?
 * 1. Incluye botón "Agregar al carrito"
 * 2. Añade event listeners a los botones
 * 3. Usa data-attributes para pasar datos al botón
 * 
 * ¿Qué son data-attributes?
 * - data-id="1" → se puede leer con btn.dataset.id
 * - Forma estándar de guardar datos en elementos HTML
 */
function mostrarProductosTienda(lista) {
  const contenedor = document.getElementById("productosTienda");
  if (!contenedor) return;

  contenedor.innerHTML = lista.map(producto => `
    <div class="product-card">
      <img src="./images/foto2.png" class="product-image" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion || ""}</p>
      <p><strong>${producto.precio}€</strong></p>
      <p>Stock: ${producto.stock}</p>
      <button
        class="btn-agregar"
        data-id="${producto.id}"
        data-nombre="${producto.nombre}"
        data-precio="${producto.precio}"
      >
        🛒 Agregar al carrito
      </button>
    </div>
  `).join("");

  // 🎯 EVENTOS PARA BOTONES "Agregar al carrito"
  // Buscar todos los botones que acabamos de crear
  const botones = contenedor.querySelectorAll(".btn-agregar");
  
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      // Leer datos del botón (data-attributes)
      const producto = {
        id: Number(btn.dataset.id),        // "1" → 1
        nombre: btn.dataset.nombre,        // "Camiseta"
        precio: Number(btn.dataset.precio) // "20" → 20
      };
      
      agregarAlCarrito(producto);
    });
  });
}

// =============================
// ✅ FINALIZAR COMPRA (ENVIAR PEDIDO AL BACKEND)
// =============================

/**
 * finalizarCompra() - Convierte carrito en pedido del backend
 * 
 * ¿Cuándo se ejecuta?
 * - Usuario hace click en "Finalizar compra"
 * 
 * ¿Qué hace?
 * 1. Validaciones: carrito vacío, usuario logueado
 * 2. Convierte carrito a formato que espera el backend
 * 3. Envía POST a /api/pedidos
 * 4. Si éxito: vacía carrito y avisa usuario
 * 5. Si error: muestra mensaje de error
 */
async function finalizarCompra() {
  // 🔍 VALIDACIONES
  if (!estado.carrito.items.length) {
    alert("El carrito está vacío");
    return;
  }

  

  // 📋 PREPARAR DATOS PARA EL BACKEND
  // El controller espera: {productos: [{producto_id, cantidad, precio}], total}
  const pedido = {
    productos: estado.carrito.items.map(item => ({
      producto_id: item.id,        // Backend espera "producto_id"
      cantidad: item.cantidad,
      precio: item.precio
    })),
    total: estado.carrito.total
  };

  try {
    // 🚀 ENVIAR PEDIDO AL BACKEND
    const respuesta = await fetch(`${URL_API}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${estado.token}` // Autenticación requerida
      },
      body: JSON.stringify(pedido)
    });

    const datos = await respuesta.json();
    console.log("📦 Respuesta crear pedido:", respuesta.status, datos);

    if (respuesta.ok) {
      // ✅ PEDIDO EXITOSO
      alert("✅ Pedido realizado con éxito");
      
      // Vaciar carrito
      estado.carrito = { items: [], total: 0 };
      guardarCarrito(); // Actualizar localStorage y UI
    } else {
      // ❌ ERROR EN PEDIDO
      alert(datos.message || "Error al crear el pedido");
    }
    
  } catch (error) {
    // ❌ ERROR DE CONEXIÓN
    console.error("❌ Error al finalizar compra:", error);
    alert("No se pudo conectar con el servidor");
  }
}

// =============================
// 🧺 PINTAR CARRITO EN LA COLUMNA DERECHA
// =============================

/**
 * pintarCarrito() - Muestra items del carrito en la interfaz
 * 
 * ¿Dónde se muestra?
 * - En el elemento <div id="carritoItems">
 * - Típicamente en una columna lateral o modal
 * 
 * ¿Qué muestra?
 * - Lista de productos en el carrito
 * - Cantidad × precio de cada uno
 * - Botón para eliminar cada producto
 */
function pintarCarrito() {
  const contenedor = document.getElementById("carritoItems");
  if (!contenedor) return;

  // 🛒 CARRITO VACÍO
  if (!estado.carrito.items.length) {
    contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    return;
  }

  // 🛒 CARRITO CON PRODUCTOS
  contenedor.innerHTML = estado.carrito.items.map(item => `
    <div class="carrito-item">
      <span class="carrito-item-nombre">${item.nombre}</span>
      <span class="carrito-item-cantidad">${item.cantidad} x ${item.precio}€</span>
      <button class="carrito-borrar" data-id="${item.id}">🗑️</button>
    </div>
  `).join("");

  // 🗑️ EVENTOS PARA BOTONES DE ELIMINAR
  const botonesBorrar = contenedor.querySelectorAll(".carrito-borrar");
  botonesBorrar.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      eliminarDelCarrito(id);
    });
  });
}


// =============================
// 🛒 CARRITO (LOCALSTORAGE). Este codigo se va a ejecutar cuando alguien ha salido sin cerrar y vuelve a entrar
//es como restaurar
// =============================

/**
 * cargarCarrito() - Restaura carrito desde localStorage cuando el usuario no ha cerrado la sesión pero ha salido de la pagina
 * 
 * ¿Cuándo se ejecuta?
 * - Al hacer login
 * - Al recargar página (si ya estaba logueado)
 * 
 * ¿Por qué localStorage?
 * - El carrito se mantiene aunque recargues la página
 * - Mejor experiencia de usuario
 */
function cargarCarrito() {
  const guardado = localStorage.getItem("carrito");
  
  if (guardado) {
    // Hay carrito guardado: restaurarlo
    estado.carrito = JSON.parse(guardado);
  } else {
    // No hay carrito: crear uno vacío
    estado.carrito = { items: [], total: 0 };
  }
  
  actualizarTotalCarrito(); // Calcular total
  pintarCarrito();         // Mostrar en pantalla
}

/**
 * guardarCarrito() - Guarda carrito en localStorage y actualiza UI
 * 
 * ¿Cuándo se ejecuta?
 * - Al agregar producto
 * - Al eliminar producto
 * - Al finalizar compra (vaciar carrito)
 */
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(estado.carrito));
  actualizarTotalCarrito(); // Recalcular total
  pintarCarrito();         // Actualizar visualización
}

/**
 * agregarAlCarrito() - Añade producto al carrito
 * 
 * @param {Object} producto - {id, nombre, precio}
 * 
 * ¿Qué hace?
 * 1. Busca si el producto ya está en el carrito
 * 2. Si está: aumenta cantidad
 * 3. Si NO está: lo añade con cantidad = 1
 * 4. Guarda y actualiza
 */
function agregarAlCarrito(producto) {
  // ¿Ya existe este producto en el carrito? añade una unidad a la que ya habia
  const existente = estado.carrito.items.find(item => item.id === producto.id);

  if (existente) {
    // ✅ Producto existe: aumentar cantidad
    existente.cantidad += 1;
  } else {
    // 🆕 Producto nuevo: añadir al carrito
    estado.carrito.items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito();
  console.log("🛒 Carrito:", estado.carrito); // Debug
  alert(`Añadido ${producto.nombre} al carrito`);
}

/**
 * eliminarDelCarrito() - Quita completamente un producto
 * 
 * @param {number} id - ID del producto a eliminar
 * 
 * ¿Qué hace?
 * - Usa .filter() para crear nuevo array sin ese producto
 * - Guarda el carrito actualizado
 */
function eliminarDelCarrito(id) {
  // .filter() = "crear nuevo array sin los elementos que cumplan condición"
  //Quédate con todos los elementos cuyo id NO sea igual al que quiero borrar
  estado.carrito.items = estado.carrito.items.filter(item => item.id !== id);
  guardarCarrito();
}

/**
 * actualizarTotalCarrito() - Calcula precio total del carrito
 * 
 * ¿Cómo calcula?
 * - Por cada producto: precio × cantidad
 * - Suma todos los subtotales
 * - Usa .reduce() para acumular
 * - Actualiza el span #totalCarrito en el HTML
 */
function actualizarTotalCarrito() {
  // reduce() va sumando (precio × cantidad) de cada producto para obtener el total final
//es un metodo muy potente de js para arrays que permite acumular en una sola variable
  const total = estado.carrito.items
    .reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    //        ↑      ↑                    ↑
    //   acumulador  item actual    operación

  estado.carrito.total = total;

  // Mostrar en el HTML
  const totalSpan = document.getElementById("totalCarrito");
  if (totalSpan) {
    totalSpan.textContent = total.toFixed(2); // .toFixed(2) = 2 decimales
  }
}



/* CURSOS */
async function verCursosJSON() {
  try {
    // fetch() = "Ve y trae los datos de esta URL"
    const respuesta = await fetch(`${URL_API}/cursos`);
    const datos = await respuesta.json();
    
    // Mostrar los datos en formato JSON legible
    const salida = document.getElementById("listaCursos");
    if (salida) {
      salida.textContent = JSON.stringify(datos, null, 2); // null, 2 = formato bonito
    }
  } catch (error) {
    // Si algo sale mal (internet, servidor caído, etc.)
    console.error("Error al obtener JSON:", error);
  }
}

/**
 * cargarCursos() - Carga y muestra Cursos en formato de tarjetas
 */
async function cargarCursos() {
  try {
    const respuesta = await fetch(`${URL_API}/cursos`);
    const datos = await respuesta.json();

    // Verificar que la petición fue exitosa Y que hay datos
    if (respuesta.ok && datos.data) {
      mostrarCursos(datos.data); // datos.data = array de Cursos
    } else {
      console.error("Error al cargar Cursos");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

/**
 * mostrarCursos() - Convierte array de Cursos en HTML
 * 
 * @param {Array} lista - Array de productos del backend
 *
 */
function mostrarCursos(lista) {
  const contenedor = document.getElementById("cursos");
  if (!contenedor) return; // Si no existe el elemento, salir

  // .map() = "Por cada Curso, crear este HTML"
  contenedor.innerHTML = lista.map(cursos => `
    <div class="curso-card">
      <img src="./images/foto.png" class="curso-image" alt="${cursos.id_curso}">
      <h3>${cursos.nombre_curso || ""}</h3>
      <p>${cursos.id_curso || ""}</p>
      <p>${cursos.id_especialidad|| ""}</p>
      <p>${cursos.fecha_realizacion || ""}</p>
      <p>${cursos.FechaCalculadaAño || ""}</p>
      <p>${cursos.practicas || ""}</p>
      <p>${cursos.id_practicas || ""}</p>
      <p>${cursos.duracion_curso || ""}</p>
      <p>${cursos.conocimientos_adquiridos || ""}</p>
      <p>${cursos.Centro_Estudio || ""}</p>
      <p>${cursos.nombre || ""}</p>
      <p>${cursos.familia || ""}</p>
      <p>${cursos.aplicaciones || ""}</p>
      
    </div>
  `).join(""); // .join("") = unir todo sin separadores
}


// =============================
// 🚀 ARRANQUE DE LA APLICACIÓN
// =============================

/**
 * DOMContentLoaded - Punto de inicio de la aplicación
 * 
 * ¿Por qué DOMContentLoaded?
 * - Se ejecuta cuando el HTML está listo
 * - Antes de este evento, getElementById() podría fallar
 * - Garantiza que todos los elementos HTML existen
 * 
 * ¿Qué inicializa?
 * 1. Event listeners para botones estáticos
 * 2. Carga inicial de productos públicos
 * 3. Restauración de sesión guardada
 * 4. Configuración de eventos de login
 * 5. Primera visualización de interfaz
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 App lista");

  // 🔘 BOTÓN "VER JSON"
  const btnVerJSON = document.getElementById("verJSON");
  if (btnVerJSON) {
    btnVerJSON.addEventListener("click", verJSON);
  }
  // 🔘 BOTÓN "VER CURSOS JSON"
  const btnVerCursosJSON = document.getElementById("verCursosJSON");
  if (btnVerCursosJSON) {
    btnVerCursosJSON.addEventListener("click", verCursosJSON);
  }
  // 🔘 BOTÓN "FINALIZAR COMPRA"
  const btnFinalizar = document.getElementById("finalizarCompra");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", finalizarCompra);
  }

  // 📋 SECUENCIA DE INICIALIZACIÓN
  cargarCursos()
  cargarProductos();        // 1. Cargar productos públicos (siempre visible)
  cargarSesionGuardada();   // 2. Restaurar sesión si existía
  configurarEventosLogin(); // 3. Conectar formularios de login/registro
  mostrarInterfaz();        // 4. Mostrar interfaz según estado de login
});


