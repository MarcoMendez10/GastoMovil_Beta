    // src/app/services/auth.service.ts
    import { Injectable } from '@angular/core';
    import { Router } from '@angular/router';

    @Injectable({
      providedIn: 'root'
    })
    export class AuthService {
      constructor(private router: Router) {}

      /**
       * Verifica si el usuario está autenticado comprobando la existencia de un token en localStorage.
       * @returns `true` si hay un token de autenticación, `false` en caso contrario.
       */
      isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        console.log('AuthService: isAuthenticated() - Token encontrado:', token ? 'Sí' : 'No');
        return !!token;
      }

      /**
       * Recupera la información del usuario actualmente logueado desde localStorage.
       * Asume que el 'authToken' es el correo del usuario serializado en JSON y que 'usuarios' es un array de objetos de usuario.
       * @returns El objeto de usuario si se encuentra y está logueado, de lo contrario `null`.
       */
      getLoggedInUser(): any | null {
        const token = localStorage.getItem('authToken');
        if (!token) {
          return null;
        }

        let loggedInUserEmail: string;
        try {
          loggedInUserEmail = JSON.parse(token); // Parseamos el token para obtener el correo
        } catch (e) {
          console.error('AuthService: Error al parsear authToken (no es un JSON válido):', e);
          return null;
        }

        const usuariosStr = localStorage.getItem('usuarios');
        if (!usuariosStr) {
          console.warn('AuthService: No se encontraron usuarios en localStorage.');
          return null;
        }

        let usuarios: any[] = [];
        try {
          usuarios = JSON.parse(usuariosStr);
        } catch (e) {
          console.error('AuthService: Error al parsear usuarios de localStorage:', e);
          return null;
        }

        // Buscar el usuario completo por su correo
        const user = usuarios.find((u: any) => u.correo === loggedInUserEmail);
        console.log('AuthService: Usuario logueado recuperado:', user);
        return user || null;
      }

      /**
       * Intenta iniciar sesión con el correo y contraseña proporcionados.
       * @param correo El correo electrónico del usuario.
       * @param contrasena La contraseña del usuario.
       * @returns `true` si el login es exitoso, `false` en caso contrario.
       */
      login(correo: string, contrasena: string): boolean {
        console.log('AuthService: Intentando iniciar sesión con correo:', correo);

        const usuariosStr = localStorage.getItem('usuarios');
        let usuarios = [];
        try {
          usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];
          console.log('AuthService: Usuarios cargados de localStorage:', usuarios);
        } catch (e) {
          console.error('AuthService: Error al parsear usuarios de localStorage:', e);
          return false;
        }

        const usuarioEncontrado = usuarios.find(
          (u: any) => u.correo === correo && u.contrasena === contrasena
        );

        if (usuarioEncontrado) {
          // Guardamos el correo del usuario como "token" para indicar que está logueado
          localStorage.setItem('authToken', JSON.stringify(usuarioEncontrado.correo));
          console.log('AuthService: Login exitoso para', correo, '. Token guardado.');
          return true;
        } else {
          const foundUserByEmail = usuarios.find((u: any) => u.correo === correo);
          if (foundUserByEmail) {
            console.warn('AuthService: Contraseña incorrecta para el correo:', correo);
          } else {
            console.warn('AuthService: Correo no encontrado:', correo);
          }
          return false;
        }
      }

      /**
       * Cierra la sesión del usuario eliminando el token de autenticación de localStorage
       * y redirigiendo a la página de login.
       */
      logout() {
        localStorage.removeItem('authToken');
        console.log('AuthService: Sesión cerrada. Token eliminado de localStorage.');
        this.router.navigateByUrl('/login'); // Redirige a la página de login
        console.log('AuthService: Redirigiendo a /login.');
      }
    }
    