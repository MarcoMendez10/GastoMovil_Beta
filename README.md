
Gasto Móvil: ⛽📊

¡Bienvenido a Gasto Móvil! Esta es una aplicación vibrante y fácil de usar, construida con Ionic y Angular, diseñada para ayudarte a tomar el control de tus gastos de combustible. Olvídate de las hojas de cálculo y los recibos perdidos; con Gasto Móvil, ¡tendrás el poder de tu billetera de combustible en la palma de tu mano!

✨ Características Estrellas
Registro Sencillo y Seguro: Crea tu cuenta en segundos con un formulario intuitivo. ¡Tu información importante está a salvo! 🔒

Inicio de Sesión Mágico: Accede a tu espacio personal con un par de toques. ¡Listo para gestionar tus finanzas! ✨

Sesión Continua (¡Como por Arte de Magia!): Aunque no es magia, usamos localStorage para que tu sesión permanezca activa mientras navegues. ¡No más inicios de sesión repetitivos! 🧙‍♂️

Fortaleza en la Seguridad: Tus datos son privados. Hemos implementado un AuthGuard que protege las áreas clave de la aplicación, ¡solo tú puedes ver tu información! 🛡️

Cierre de Sesión Limpio: Cuando termines, tu sesión se cierra de forma segura, eliminando tu token y redirigiéndote de vuelta al punto de partida. ¡Privacidad garantizada! 🚪➡️

Próximamente: ¡Funcionalidades increíbles para registrar, visualizar y analizar tus gastos de combustible! (¡Mantente al tanto! 😉)
🛠️ Tecnologías Bajo el Capó

Ionic Framework: El corazón de nuestra UI, para un look & feel nativo en cualquier plataforma. 💖
Angular: El cerebro que organiza y potencia toda la lógica de la aplicación. 🧠
TypeScript: Código más limpio, robusto y fácil de mantener. ¡Adiós a los errores sorpresa! ✅
HTML & SCSS: Dando vida y estilo a cada pantalla. 🎨
Capacitor: La promesa de llevar Gasto Móvil directamente a tu teléfono (Android e iOS). 📱
🚀 ¡Arranca el Proyecto en un Instante!

¿Listo para poner a rodar Gasto Móvil en tu máquina? ¡Es más fácil de lo que piensas!

1. Prepara tu Entorno ⚙️
Asegúrate de tener instalados los siguientes esenciales:

Node.js y npm: Descárgalos desde nodejs.org. Son la base de todo.
Ionic CLI: Nuestra navaja suiza para proyectos Ionic. Instálala globalmente con:
Bash

npm install -g @ionic/cli
2. Clona el Tesoro 📦
Si aún no tienes el código, ¡es hora de clonarlo!

Bash

git clone <URL_DE_TU_REPOSITORIO> # 👈 ¡Pon aquí la URL real de tu repo!
cd gasto-movil
3. Dale Energía a las Dependencias ✨
Una vez dentro de la carpeta del proyecto, instala todas las librerías necesarias:

Bash

npm install
4. ¡Enciende el Motor y a Desarrollar! 🏎️💨
Ahora, lanza la aplicación en tu navegador. ¡Verás la magia suceder!

Bash

ionic serve
Tu app se abrirá automáticamente (usualmente en http://localhost:8100/).

5. ¿Problemas con la Caché? ¡Dale un Reseteo! 🧹
Si alguna vez sientes que algo no se actualiza o hay datos raros, una limpieza de caché es tu mejor amiga:

Bash

ionic cache clean
npm cache clean --force
🗺️ Un Vistazo Rápido a la Estructura (¡Nuestros Héroes del Código!)
src/app/registro/: Donde la magia del registro ocurre. Aquí se capturan tus datos con un formulario reactivo y se guardan en el localStorage bajo la clave 'usuarios'.
src/app/login/: La puerta de entrada a la aplicación. Maneja el formulario de inicio de sesión y se comunica con nuestro AuthService para validar tus credenciales.
src/app/home/: ¡Tu centro de operaciones! Esta es una ruta protegida y aquí encontrarás la lógica para cerrar sesión de forma segura.
src/app/services/auth.service.ts: ¡El cerebro de la autenticación! Contiene la lógica para login(), logout() e isAuthenticated(). Es el guardián de tu authToken en localStorage y el verificador de tus usuarios.
src/app/guards/auth.guard.ts: Nuestro vigilante de rutas. Se asegura de que solo los usuarios autenticados puedan acceder a las áreas protegidas de la app. Si no estás logueado, ¡te enviará de vuelta al login!
src/app/app.routes.ts: El mapa de nuestra aplicación. Define cada camino y dónde el AuthGuard entra en acción para protegerte.
🔒 ¡Cómo Funciona la Magia de la Autenticación!
Hemos simulado un sistema de autenticación robusto, usando el localStorage de tu navegador para mantener la sesión y los datos de usuario. ¡Así es como funciona!

¡Al Registrarte! 📝

Tus datos de usuario (correo, contraseña y más) son capturados de forma segura por el formulario.
Luego, los guardamos en el localStorage de tu navegador, dentro de un array JSON llamado 'usuarios'.
¡Registro exitoso! Te enviamos directamente a la pantalla de login, listo para entrar.
¡Al Iniciar Sesión! 🔑

Ingresas tu correo y contraseña.
Nuestro AuthService (el login() para ser exactos) busca tu perfil en ese array 'usuarios' que guardamos.
¡Coincidencia! 🎉 Si tus credenciales son correctas, guardamos un pequeño "ticket" (tu correo serializado como JSON) en localStorage bajo la clave 'authToken'. ¡Ese es tu pase VIP!
¡Bienvenido! Eres redirigido directamente a la página de inicio (/home).
¡El Poder del AuthGuard! 🛡️

¿Intentas ir a /home o cualquier otra página secreta? El AuthGuard se activa al instante.
Le pregunta a AuthService.isAuthenticated(): "¿Hay un authToken aquí?"
Si la respuesta es SÍ, ¡adelante! Tienes acceso.
Si la respuesta es NO, ¡alto ahí! Te redirigimos de vuelta a la pantalla de login. ¡Seguridad ante todo!
¡Cierre de Sesión Limpio! 👋

Cuando haces clic en "Cerrar Sesión", llamamos a AuthService.logout().
Este método, con su magia, elimina tu 'authToken' de localStorage. ¡Tu sesión está oficialmente cerrada!
Para tu comodidad, te redirigimos de inmediato a la pantalla de login. Así, la próxima vez, sabrás exactamente dónde empezar.
