import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Mantén si vas a usar formularios en el futuro (ej. para un input de correo)
import { IonicModule } from '@ionic/angular'; // Asegúrate de que IonicModule esté aquí
import { AlertController } from '@ionic/angular'; // Para mostrar alertas

@Component({
  selector: 'app-pro',
  templateUrl: './pro.page.html',
  styleUrls: ['./pro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule], // Asegúrate de que estén en imports
})
export class ProPage implements OnInit {

  constructor(private alertController: AlertController) { } // Inyecta AlertController

  ngOnInit() {
  }

  async notificarme() {
    const alert = await this.alertController.create({
      header: '¡Gracias por tu interés!',
      message: 'Te notificaremos cuando la versión Pro esté disponible. ¡Pronto más novedades!',
      buttons: ['OK'],
    });
    await alert.present();
  }

}