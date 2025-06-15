// src/app/configuracion/configuracion.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ¡Necesario para [(ngModel)]!
import { IonicModule, ToastController, LoadingController, AlertController, Platform } from '@ionic/angular'; // ¡IMPORTAR IONICMODULE AQUÍ!


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [ // <--- ¡AQUÍ ES DONDE NECESITAMOS AÑADIRLOS!
    IonicModule, // <-- ¡Importante! Esto hace que los componentes Ionic sean conocidos
    CommonModule,
    FormsModule // <-- ¡Necesario para [(ngModel)] en ion-toggle!
  ]
})
export class ConfiguracionPage implements OnInit {

  // Propiedades para los toggles de configuración
  notificationsEnabled: boolean = true;
  syncWifiOnly: boolean = false;
  biometricEnabled: boolean = false;

  // Propiedades para el estado de los permisos (simulados)
  locationPermission: boolean = false;
  cameraPermission: boolean = false;

  // Tamaño de caché simulado
  cacheSize: string = '5.2 MB'; // Valor inicial simulado

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.checkAppPermissions();
  }

  // --- Cargar Configuraciones al Inicio ---
  loadSettings() {
    this.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
    this.syncWifiOnly = localStorage.getItem('syncWifiOnly') === 'true';
    this.biometricEnabled = localStorage.getItem('biometricEnabled') === 'true';
  }

  // --- Lógica de Notificaciones ---
  async toggleNotifications() {
    localStorage.setItem('notificationsEnabled', this.notificationsEnabled.toString());
    const message = this.notificationsEnabled ? 'Notificaciones habilitadas.' : 'Notificaciones deshabilitadas.';
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  // --- Lógica de Sincronización Wi-Fi ---
  async toggleSyncWifi() {
    localStorage.setItem('syncWifiOnly', this.syncWifiOnly.toString());
    const message = this.syncWifiOnly ? 'Sincronización solo con Wi-Fi activada.' : 'Sincronización con datos móviles habilitada.';
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  // --- Lógica de Autenticación Biométrica ---
  async toggleBiometrics() {
    if (this.platform.is('hybrid')) {
      localStorage.setItem('biometricEnabled', this.biometricEnabled.toString());
      const message = this.biometricEnabled ? 'Autenticación biométrica activada.' : 'Autenticación biométrica deshabilitada.';
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Función no disponible',
        message: 'La autenticación biométrica solo está disponible en dispositivos móviles (Android/iOS).',
        buttons: ['OK']
      });
      await alert.present();
      this.biometricEnabled = false;
    }
  }

  // --- Lógica de Limpiar Caché ---
  async clearCache() {
    const loading = await this.loadingController.create({
      message: 'Limpiando caché...',
      duration: 1500
    });
    await loading.present();

    await new Promise(resolve => setTimeout(resolve, 1500));
    this.cacheSize = '0 KB';

    const toast = await this.toastController.create({
      message: 'Caché de la aplicación limpiada.',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    await loading.dismiss();
  }

  // --- Verificar Permisos de la Aplicación ---
  async checkAppPermissions() {
    this.locationPermission = Math.random() > 0.5;
    this.cameraPermission = Math.random() > 0.5;
  }

  // --- Abrir Ajustes del Sistema (funcionalidad indicativa) ---
  async openAppSettings() {
    const alert = await this.alertController.create({
      header: 'Ajustes del Sistema',
      message: 'Para gestionar los permisos de la aplicación, por favor, ve a los ajustes de tu dispositivo móvil.',
      buttons: ['OK']
    });
    await alert.present();
  }
}