// src/app/components/user-options-popover/user-options-popover.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ¡Importante! Asegúrate de que FormsModule esté importado
import { IonicModule, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta a AuthService sea correcta

@Component({
  selector: 'app-user-options-popover',
  templateUrl: './user-options-popover.component.html',
  styleUrls: ['./user-options-popover.component.scss'],
  standalone: true, // Indica que este es un componente independiente
  imports: [
    IonicModule,
    CommonModule,
    FormsModule // Necesario para [(ngModel)] en el ion-segment
  ]
})
export class UserOptionsPopoverComponent implements OnInit {

  @Input() currentTheme: string = 'default'; // Propiedad de entrada para el tema actual desde el componente padre
  selectedTheme: string = 'default'; // Propiedad para vincular con [(ngModel)] en el ion-segment

  constructor(
    private popoverController: PopoverController,
    private router: Router, // Inyecta el Router
    private authService: AuthService // Inyecta el AuthService
  ) { }

  ngOnInit() {
    // Inicializa 'selectedTheme' con el 'currentTheme' recibido cuando el componente se inicia
    this.selectedTheme = this.currentTheme;
  }

  /**
   * Maneja el evento de cambio del ion-segment (selector de tema).
   * Cierra el popover y envía la acción 'changeTheme' con el nuevo tema seleccionado
   * de vuelta al componente padre (home.page.ts en este caso).
   * @param event El evento de cambio que contiene el nuevo valor del segmento.
   */
  onThemeChange(event: any) {
    this.selectedTheme = event.detail.value; // Actualiza el valor de selectedTheme
    this.popoverController.dismiss({
      action: 'changeTheme',
      newTheme: this.selectedTheme
    });
  }

  /**
   * Navega a una ruta específica y cierra el popover.
   * Envía la acción 'navigate' con la ruta para que el componente padre pueda manejar la navegación.
   * @param path La ruta a la que se desea navegar (ej. '/perfil', '/configuracion').
   */
  navigateTo(path: string) {
    this.popoverController.dismiss({
      action: 'navigate',
      path: path
    });
  }

  /**
   * Cierra la sesión del usuario.
   * Cierra el popover y luego realiza el logout a través de AuthService,
   * redirigiendo al usuario a la página de login.
   */
  logout() {
    this.popoverController.dismiss({
      action: 'logout' // Notifica al componente padre que se ha solicitado el logout
    });
    this.authService.logout(); // Llama al método de logout del servicio de autenticación
    this.router.navigateByUrl('/login', { replaceUrl: true }); // Redirige al usuario a la página de login
  }
}
