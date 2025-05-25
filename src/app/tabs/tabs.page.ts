import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router'; // Importa RouterModule y Routes

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule] // Agrega RouterModule aquí
})
export class TabsPage {

  constructor() { }

  // Define las rutas para tus pestañas
  // NOTA: Estas rutas serán hijas de la ruta 'app' o 'main' que definiremos en app.routes.ts
  public static readonly tabRoutes: Routes = [
    {
      path: 'home',
      loadComponent: () => import('../home/home.page').then(m => m.HomePage)
    },
    {
      path: 'calculadora',
      loadComponent: () => import('../calculadora/calculadora.page').then(m => m.CalculadoraPage)
    },
    {
      path: 'pro',
      loadComponent: () => import('../pro/pro.page').then(m => m.ProPage)
    },
    {
      path: '',
      redirectTo: '/app/home', // Redirige a la pestaña de inicio por defecto
      pathMatch: 'full'
    }
  ];

}