GastoMóvil - Guía de Inicio Rápido
Esta guía te ayudará a configurar y ejecutar el proyecto GastoMóvil en tu entorno de desarrollo.

Requisitos Previos
Antes de comenzar, asegúrate de tener instalado lo siguiente:

Node.js: Versión 18.x o superior.

Puedes descargarlo desde: nodejs.org

Ionic CLI: La interfaz de línea de comandos de Ionic.

Instálala globalmente ejecutando en tu terminal:

npm install -g @ionic/cli

Pasos para la Configuración y Ejecución
Sigue estos pasos para iniciar el proyecto:

Clona el Repositorio (si aplica)
Si el proyecto está en un repositorio Git, clónalo:

git clone <URL_DEL_REPOSITORIO>
cd GastoMovil

Si ya tienes los archivos localmente, simplemente navega a la raíz del proyecto.

Instalar Dependencias de Node.js
Desde la raíz de tu proyecto, instala todas las dependencias necesarias:

npm install

Este comando descargará e instalará todas las librerías listadas en package.json.

Sincronizar Plugins de Capacitor (si construyes para móvil/escritorio)
Si vas a ejecutar en un dispositivo o emulador, o si has añadido nuevos plugins, sincroniza el proyecto:

npx cap sync

Ejecutar la Aplicación en el Navegador
Para desarrollar y probar tu aplicación en el navegador web:

ionic serve

Esto abrirá automáticamente tu navegador en http://localhost:8100 (o un puerto similar). Los cambios que hagas en el código se reflejarán en tiempo real.

Ejecutar en un Dispositivo/Emulador (Opcional)
Asegúrate de tener un emulador configurado o un dispositivo conectado y depurando.

Android:

ionic capacitor run android

iOS: (Requiere Xcode en macOS)

ionic capacitor run ios

¡Eso es todo! Con estos pasos, tu proyecto GastoMóvil debería estar listo para funcionar. Si encuentras algún problema, revisa los mensajes de error en tu terminal y en la consola del navegador.
