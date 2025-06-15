// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // ¡Importa el AuthGuard!

export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'calculadora',
    loadComponent: () => import('./calculadora/calculadora.page').then(m => m.CalculadoraPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'pro',
    loadComponent: () => import('./pro/pro.page').then(m => m.ProPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabs', // Si tienes un setup con pestañas (tabs)
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./estadisticas/estadisticas.page').then(m => m.EstadisticasPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'bencineras',
    loadComponent: () => import('./bencineras/bencineras.page').then(m => m.BencinerasPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'rutaplaneada',
    loadComponent: () => import('./rutaplaneada/rutaplaneada.page').then(m => m.RutaplaneadaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then(m => m.HistorialPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'acerca-de',
    loadComponent: () => import('./acercade/acercade.page').then(m => m.AcercaDePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'nueva-carga',
    loadComponent: () => import('./nueva-carga/nueva-carga.page').then(m => m.NuevaCargaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-auto',
    loadComponent: () => import('./mi-auto/mi-auto.page').then( m => m.MiAutoPage),
    canActivate: [AuthGuard]
  },
  // ¡NUEVO! Rutas de perfil y configuración movidas antes del comodín
  {
    path: 'configuracion',
    loadComponent: () => import('./configuracion/configuracion.page').then( m => m.ConfiguracionPage),
    canActivate: [AuthGuard] // Protegida por el guardia
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage),
    canActivate: [AuthGuard] // Protegida por el guardia
  },
  
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];