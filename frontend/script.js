// 🌐 URL de nuestra API
const URL_API = "http://localhost:3000/api";

// Arranque básico

// 🚀 Cuando la página termine de cargar, ejecutamos la función
document.addEventListener("DOMContentLoaded", async function()  {
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

// ==============================================
// 🔐 AUTENTICACIÓN DE USUARIOS
// ==============================================================
let estado = {
  usuario: null,   // { id, nombre, email }
  token: null      // string con el JWT
};
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
  const authNav     = document.getElementById('authNav'); // si lo tienes

  const logged = !!estado.usuario;

  // Formulario login/registro
  if (authSection) {
    if (logged) {
      authSection.classList.add('hidden');
    } else {
      authSection.classList.remove('hidden');
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
  const loginForm    = document.getElementById('loginFormElement');
  const registerForm = document.getElementById('registerFormElement');
  const showRegister = document.getElementById('showRegister');
  const showLogin    = document.getElementById('showLogin');

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await iniciarSesion(email, password);
      loginForm.reset();
    });
  }

  // REGISTRO
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre   = document.getElementById('registerNombre').value;
      const email    = document.getElementById('registerEmail').value;
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

