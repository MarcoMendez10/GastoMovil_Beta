// src/app/app.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core'; // Añadido OnDestroy
import { Router, RouterModule } from '@angular/router';
import { IonicModule, MenuController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MenuFilterService } from './services/menu-filter.service'; // ¡NUEVO! Importar el servicio
import { Subscription } from 'rxjs'; // Para gestionar la suscripción

interface UserInfo {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
}

interface AppPage {
  title: string;
  url: string;
  icon?: string;
  svgIcon?: string;
  color?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    CommonModule
  ],
})
export class AppComponent implements OnInit, OnDestroy { // Implementar OnDestroy
  usuario: UserInfo | null = null;

  // Lista COMPLETA de todas las páginas del menú
  public appPages: AppPage[] = [
    { title: 'Inicio', url: '/home', icon: 'home', svgIcon: '<svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-house-up-fill" viewBox="0 0 16 16" style="color: black;"><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 1 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.707l1.5-1.5a.5.5 0 0 1 .708 0Z"/><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/><path d="m8 3.293 4.712 4.712A4.5 4.5 0 0 0 8.758 15H3.5A1.5 1.5 0 0 1 2 13.5V9.293z"/></svg>'},
    { title: 'Estadísticas', url: '/estadisticas', icon: 'stats-chart', svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-fuel-pump-fill" viewBox="0 0 16 16" style="color: black;"><path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z"/></svg>'}, 
    { title: 'Bencineras', url: '/bencineras', icon: 'business', svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-fuel-pump-fill" viewBox="0 0 16 16" style="color: black;"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"/></svg>'},
    { title: 'Ruta Planeada', url: '/rutaplaneada', icon: 'map', svgIcon: '<svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pin-map-fill" viewBox="0 0 16 16" style="color: black;"><path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8z"/><path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/></svg>'},
    { title: 'Historial', url: '/historial', icon: 'time', svgIcon: '<svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16" style="color: black;"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/><path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/><path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/></svg>'},
    { title: 'Calculadora', url: '/calculadora', icon: 'calculator', svgIcon: '<svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-calculator-fill" viewBox="0 0 16 16" style="color: black;"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5m0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5z"/></svg>'},
    { title: 'Mi Auto', url: '/mi-auto', icon: 'car', svgIcon: '<svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-car-front-fill" viewBox="0 0 16 16" style="color: black;"><path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/></svg>'},
    { title: 'Versión Pro', url: '/pro', icon: 'star', svgIcon: '<svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16" style="color: black;"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>'},
    { title: 'Acerca de', url: '/acerca-de', icon: 'information-circle', svgIcon: '<svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-info-square-fill" viewBox="0 0 16 16"style="color: black;"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg>'}
  ];

  public filteredAppPages: AppPage[] = []; // La lista que se mostrará en el menú
  private menuFilterSubscription: Subscription | undefined; // Para limpiar la suscripción

  constructor(
    private router: Router,
    private alertController: AlertController, // Inyectar AlertController
    private menu: MenuController, // Inyectar MenuController (usando 'menu' como nombre)
    private authService: AuthService, // Inyectar AuthService
    private menuFilterService: MenuFilterService // ¡NUEVO! Inyectar el servicio de filtro
  ) {
    this.filteredAppPages = [...this.appPages]; // Inicializar con todos los ítems
  }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    // ¡NUEVO! Suscribirse a los cambios del término de búsqueda del servicio
    this.menuFilterSubscription = this.menuFilterService.searchTerm$.subscribe(searchTerm => {
      this.filterMenuItems(searchTerm); // Llamar a la función de filtro con el término recibido
    });
  }

  /**
   * Carga la información del usuario logueado.
   */
  cargarUsuarioLogueado() {
    this.usuario = this.authService.getLoggedInUser();
    if (!this.usuario) {
      console.warn('AppComponent: No se pudo cargar la información del usuario logueado.');
    } else {
      console.log('AppComponent: Usuario logueado:', this.usuario.correo);
    }
  }

  /**
   * Cierra el menú lateral.
   */
  async closeMenu() {
    await this.menu.close();
  }

  /**
   * Filtra los ítems del menú basándose en el término de búsqueda.
   * Ahora recibe el término directamente (no un evento).
   * @param searchTerm El término de búsqueda como string.
   */
  filterMenuItems(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    
    if (!lowerCaseSearchTerm) {
      this.filteredAppPages = [...this.appPages]; // Si el buscador está vacío, muestra todos
    } else {
      this.filteredAppPages = this.appPages.filter(page => {
        return page.title.toLowerCase().includes(lowerCaseSearchTerm);
      });
    }
  }

  /**
   * Muestra una alerta de confirmación para cerrar la sesión.
   */
  async cerrarSesion() { 
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cerrar sesión cancelado');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            this.authService.logout();
            this.closeMenu();
            console.log('Sesión cerrada.');
          },
        },
      ],
    });

    await alert.present();
  }

  // ¡Importante! Desuscribirse para evitar fugas de memoria
  ngOnDestroy() {
    if (this.menuFilterSubscription) {
      this.menuFilterSubscription.unsubscribe();
    }
  }
}
