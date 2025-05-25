// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // <-- ¡IMPORTA EL AUTHGUARD!

export const routes: Routes = [
  // Ruta por defecto: redirige a 'login' si no hay otra ruta
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Rutas de autenticación (NO protegidas por el guardia)
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  // Rutas principales de la aplicación (¡AHORA PROTEGIDAS POR EL GUARDIA!)
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'calculadora',
    loadComponent: () => import('./calculadora/calculadora.page').then(m => m.CalculadoraPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'pro',
    loadComponent: () => import('./pro/pro.page').then(m => m.ProPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'tabs', // Si tienes un setup con pestañas (tabs)
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./estadisticas/estadisticas.page').then(m => m.EstadisticasPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'bencineras',
    loadComponent: () => import('./bencineras/bencineras.page').then(m => m.BencinerasPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'rutaplaneada',
    loadComponent: () => import('./rutaplaneada/rutaplaneada.page').then(m => m.RutaplaneadaPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then(m => m.HistorialPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'acerca-de',
    loadComponent: () => import('./acercade/acercade.page').then(m => m.AcercaDePage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'nueva-carga',
    loadComponent: () => import('./nueva-carga/nueva-carga.page').then(m => m.NuevaCargaPage),
    canActivate: [AuthGuard] // <-- ¡Protege esta ruta!
  },
  {
    path: 'mi-auto', // ¡La ruta que te estaba causando problemas!
    loadComponent: () => import('./mi-auto/mi-auto.page').then( m => m.MiAutoPage),
    canActivate: [AuthGuard] // <-- ¡AHORA ESTÁ PROTEGIDA!
  },
  // Ruta comodín: si se accede a una ruta no definida, redirige a login
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];