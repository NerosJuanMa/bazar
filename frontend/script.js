// 🌐 URL de nuestra API
const URL_API = "http://localhost:3000/api";

// -Estado global de la aplicacion. Quién está conectado
let estado = {
    usuario: null,          // 👤 Información del usuario conectado (null = nadie conectado)
    token: null,
    productos: [],
    carrito: []
};


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
document.addEventListener("DOMContentLoaded", async function()  {
    console.log('🚀 ¡Iniciando Bazar Online!');
     try {   
    
    cargarSesionGuardada();
    configurarEventos();
    await verificarServidor();
    await cargarProductos();
    mostrarInterfaz();
          
        console.log('✅ ¡Todo listo! La aplicación está funcionando correctamente.');
        
    } catch (error) {
        // 🚨 Si algo sale mal, mostrar un mensaje de error al usuario
        console.error('❌ Error durante la inicialización:', error);
        mostrarAlerta('Error de Conexión', 'No se pudo conectar con el servidor. ¿Está funcionando el backend?');
    }
});
/**
 * 📱 FUNCIÓN: CARGAR SESIÓN GUARDADA EN EL NAVEGADOR*/
function cargarSesionGuardada() {
    // 🔍 Buscar información guardada en el navegador
    const tokenGuardado = localStorage.getItem('token');      // Clave de autenticación
    const usuarioGuardado = localStorage.getItem('user');    // Datos del usuario
    
    // ✅ Si encontramos ambos datos, restaurar la sesión
    if (tokenGuardado && usuarioGuardado) {
        try {
            // 📄 Restaurar datos en la memoria de la aplicación
            estado.token = tokenGuardado;                           // Guardar la clave secreta
            estado.usuario = JSON.parse(usuarioGuardado);          // Convertir texto a objeto JavaScript
            
            console.log('👤 Bienvenido de nuevo,', estado.usuario.nombre);
        } catch (error) {
            // 🚨 Si los datos están corruptos, limpiar todo y empezar de cero
            console.error('❌ Sesión corrupta encontrada, limpiando datos...');
            cerrarSesion();
        }
    }
}
/**
 * 💾 FUNCIÓN: GUARDAR SESIÓN EN EL NAVEGADOR*/
  function guardarSesion(token, usuario) {
    // 📝 Actualizar la memoria inmediata de la aplicación
    estado.token = token;
    estado.usuario = usuario;
    
    // 💾 Guardar en la memoria persistente del navegador
    localStorage.setItem('token', token);                        // Guardar clave secreta
    localStorage.setItem('user', JSON.stringify(usuario));      // Convertir objeto a texto y guardar
    
    console.log('💾 Sesión guardada correctamente para:', usuario.nombre);
}

function cerrarSesion() {
    // 🧹 Limpiar la memoria inmediata de la aplicación
    estado.token = null;           // Borrar clave secreta
    estado.usuario = null;         // Borrar información del usuario
    estado.carrito = [];          // Vaciar carrito de compras
    estado.pedidos = [];          // Limpiar lista de pedidos
    
    // 🗑️ Limpiar la memoria persistente del navegador
    localStorage.removeItem('token');    // Eliminar clave secreta guardada
    localStorage.removeItem('user');     // Eliminar datos del usuario guardados
    
    console.log('👋 Sesión cerrada correctamente');
    
    // 🔄 Actualizar la interfaz para mostrar formularios de login
    mostrarInterfaz(); 
}

function obtenerCabecerasAuth() {
    return {
        'Content-Type': 'application/json',                    // Enviamos datos en formato JSON
        'Authorization': `Bearer ${estado.token}`             // Incluimos el token del usuario
    };
}

    /**
 * 🔑 Inicia sesión con email y contraseña
 */
async function iniciarSesion(email, password) {
    try {
        const respuesta = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const datos = await respuesta.json();
        
        if (respuesta.ok) {
            guardarSesion(datos.token, datos.usuario);
            await cargarDatosUsuario();
            mostrarInterfaz();
            mostrarAlerta('¡Bienvenido!', `Hola ${datos.usuario.nombre}`);
        } else {
            throw new Error(datos.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('❌ Error login:', error);
        throw error;
    }
}

/**
 * 📝 Registra un nuevo usuario 
 */
async function registrarUsuario(nombre, email, password) {
    try {
        console.log('📝 Intentando registrar usuario:', email);
        
        const respuesta = await fetch(`${URL_API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });
        
        const datos = await respuesta.json();
        console.log('📡 Respuesta del servidor:', respuesta.status, datos);
        
        if (respuesta.ok) {
            guardarSesion(datos.token, datos.usuario);
            
            // Para usuarios nuevos, no cargar pedidos inmediatamente
            // Solo actualizar la interfaz
            mostrarInterfaz();
            mostrarAlerta('¡Registrado!', `Bienvenido ${datos.usuario.nombre}`);
            console.log('✅ Usuario registrado exitosamente');
        } else {
            throw new Error(datos.message || 'Error al registrarse');
        }
    } catch (error) {
        console.error('❌ Error registro:', error);
        throw error;
    }
}

/**
 * 🔐 Configura eventos de autenticación
 */
function configurarEventosLogin() {
    // Formulario de login
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                await iniciarSesion(email, password);
                e.target.reset();
            } catch (error) {
                mostrarAlerta('Error', error.message);
            }
        });
        console.log('✅ Eventos de login configurados');
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const nombre = document.getElementById('registerNombre').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                await registrarUsuario(nombre, email, password);
                e.target.reset();
            } catch (error) {
                mostrarAlerta('Error', error.message);
            }
        });
        console.log('✅ Eventos de registro configurados');
    }
    
    // Alternar formularios
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister && showLogin) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        });
        
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        });
        console.log('✅ Alternado de formularios configurado');
    }
}

function mostrarInterfaz() {
    
    // Helper function para mostrar/ocultar elementos de forma segura
    const toggleElement = (id, show) => {
        const element = document.getElementById(id);
        if (element) {
            if (show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        } else {
            console.warn(`⚠️ Elemento ${id} no encontrado`);
        }
    };
    
    if (estado.usuario) {
        // Usuario logueado - mostrar secciones principales
        toggleElement('authSection', false);
        toggleElement('catalogSection', true);
       
    } else {
        // Usuario no logueado - mostrar catálogo y login
        toggleElement('authSection', true);
        toggleElement('catalogSection', true);  // ✅ Mostrar productos aunque no esté logueado
        
    }
    
    // 🔄 IMPORTANTE: Actualizar productos para reflejar estado del usuario
    mostrarProductos();
}