// src/app/home/home.page.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController, ToastController, Platform } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

// *** ESTAS DOS LÍNEAS SON CRÍTICAS PARA SWIPER EN IONIC 7+ ***
import { register } from 'swiper/element/bundle';
register();

import { UserOptionsPopoverComponent } from '../components/user-options-popover/user-options-popover.component';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClientModule } from '@angular/common/http'; 
import { MenuFilterService } from '../services/menu-filter.service'; // ¡NUEVO! Importar el servicio

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    UserOptionsPopoverComponent
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA] // Solo si usas web components sin definir sus inputs/outputs
})
export class HomePage implements OnInit, OnDestroy {

  swiperConfig: any = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  selectedTheme: string = 'default';
  
  // Las propiedades de filtrado (allHomeItems, filteredServiceItems, searchTermActive)
  // ya no son necesarias en HomePage si el buscador es solo para el menú lateral.
  // Si en el futuro quieres un buscador para el contenido de Home, necesitarás añadirlas aquí.

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private platform: Platform,
    private menuFilterService: MenuFilterService // ¡NUEVO! Inyectar el servicio de filtro
  ) {}

  async ngOnInit() {
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
      this.selectedTheme = savedTheme;
      this.applyTheme(savedTheme);
    } else {
      this.applyTheme('default');
    }

    if (this.platform.is('capacitor')) {
      await this.requestNotificationPermissions();
    }
  }

  // ¡NUEVO! Método para manejar la entrada del buscador y enviarla al servicio
  // Este método se llamará desde el ion-searchbar en home.page.html
  filterMenuItemsInMenu(event: any) {
    const searchTerm = event.detail.value;
    // Envía el término de búsqueda al servicio. AppComponent lo recibirá y filtrará el menú.
    this.menuFilterService.setSearchTerm(searchTerm);
  }

  changeTheme(themeName: string) {
    this.selectedTheme = themeName;
    this.applyTheme(themeName);
    localStorage.setItem('userTheme', themeName);
  }

  private applyTheme(themeName: string) {
    document.body.classList.remove('ion-color-theme-dark');
    if (themeName !== 'default') {
      document.body.classList.add(`ion-color-theme-${themeName}`);
    }
  }

  async presentThemePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: UserOptionsPopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'my-custom-popover',
      componentProps: {
        currentTheme: this.selectedTheme
      }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data) {
      if (data.action === 'changeTheme' && data.newTheme) {
        this.changeTheme(data.newTheme);
      } else if (data.action === 'navigate' && data.path) {
        this.router.navigateByUrl(data.path);
      }
    }
  }

  goToSomePage(path: string) {
    this.router.navigateByUrl(path);
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  async requestNotificationPermissions() {
    if (!this.platform.is('capacitor')) {
      console.warn('LocalNotifications plugin solo funciona en entornos nativos (Capacitor) o como PWA en algunos navegadores.');
      return;
    }
    try {
      const permStatus = await LocalNotifications.requestPermissions();
      if (permStatus.display === 'granted') {
        this.presentToast('Permisos de notificación concedidos.', 'success');
        console.log('Permisos de notificación concedidos.');
      } else {
        this.presentToast('Permisos de notificación denegados.', 'danger');
        console.warn('Permisos de notificación denegados:', permStatus.display);
      }
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      this.presentToast('Error al solicitar permisos de notificación.', 'danger');
    }
  }

  async scheduleTestNotification() {
    if (!this.platform.is('capacitor')) {
      this.presentToast('Las notificaciones locales solo funcionan en iOS/Android o PWA instalada.', 'warning');
      return;
    }

    try {
      const result = await LocalNotifications.schedule({
        notifications: [
          {
            title: '¡Recordatorio Gasto Móvil!',
            body: '¡No olvides registrar tu última recarga de combustible!',
            id: 10,
            schedule: { at: new Date(Date.now() + 1000 * 3) },
            actionTypeId: '',
            extra: null
          }
        ]
      });
      this.presentToast('Notificación programada para aparecer en 3 segundos.', 'success');
      console.log('Notificación programada:', result);
    } catch (error) {
      console.error('Error al programar la notificación:', error);
      this.presentToast('Error al programar la notificación.', 'danger');
    }
  }

  ngOnDestroy() {
    // Aquí podrías limpiar si tuvieras suscripciones locales, pero en este caso,
    // el trabajo del buscador se delega al servicio y app.component.
  }
}
