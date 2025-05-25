// src/app/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/home');
    }
  }

  async iniciarSesion() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      // ¡AQUÍ ESTÁ LA CORRECCIÓN!
      const { correo, contrasena } = this.loginForm.value; // Desestructuras el objeto para obtener las propiedades
      console.log('login.page.ts: Intentando iniciar sesión con:', { correo, contrasena }); // Nuevo log para verificar

      // Pasa el correo y la contraseña como argumentos individuales
      if (this.authService.login(correo, contrasena)) {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: '¡Bienvenido!',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigateByUrl('/home');
      } else {
        const alert = await this.alertController.create({
          header: 'Error de autenticación',
          message: 'Correo o contraseña incorrectos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Formulario Inválido',
        message: 'Por favor, introduce un correo electrónico y una contraseña válidos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/registro');
  }
}