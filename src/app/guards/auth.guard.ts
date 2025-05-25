// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta a tu AuthService sea correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate { // <-- Declara que implementa CanActivate

  constructor(private authService: AuthService, private router: Router) {}

  // ¡ESTE ES EL MÉTODO CRÍTICO QUE DEBE ESTAR PRESENTE Y COMPLETO!
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isAuthenticated()) {
      return true; // El usuario está autenticado, permite el acceso a la ruta
    } else {
      // El usuario NO está autenticado, redirige a la página de login
      console.warn('AuthGuard: Usuario no autenticado. Redirigiendo a /login');
      return this.router.createUrlTree(['/login']); // Usa createUrlTree para una redirección limpia
    }
  }
}