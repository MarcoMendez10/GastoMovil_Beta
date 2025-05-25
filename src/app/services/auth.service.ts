// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    console.log('AuthService: isAuthenticated() - Token encontrado:', token ? 'Sí' : 'No');
    return !!token;
  }

  login(correo: string, contrasena: string): boolean {
    // ... (tu código de login actual, que ya validamos que está bien) ...
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

  logout() {
    // ¡ESTA ES LA PARTE CRÍTICA PARA EL LOGOUT!
    localStorage.removeItem('authToken'); // Asegura que la clave sea 'authToken'
    console.log('AuthService: Sesión cerrada. Token eliminado de localStorage.');
    this.router.navigateByUrl('/login'); // Redirige al login
    console.log('AuthService: Redirigiendo a /login.'); // Log después de la redirección
  }
}