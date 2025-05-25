// src/app/registro/registro.page.ts (solo las partes relevantes)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9,12}$')]],
      genero: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena')?.value;
    const confirmPassword = form.get('confirmarContrasena')?.value;
    return password && confirmPassword && password === confirmPassword
      ? null : { mismatch: true };
  }

  async registrarse() {
    this.registroForm.markAllAsTouched();

    if (this.registroForm.valid) {
      const { correo, contrasena, nombre, apellido, telefono, genero } = this.registroForm.value;

      const usuariosStr = localStorage.getItem('usuarios');
      let usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

      if (usuarios.some((u: any) => u.correo === correo)) {
        const alert = await this.alertController.create({
          header: 'Error de Registro',
          message: 'El correo electrónico ya está registrado.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      // Añadir el nuevo usuario con todos los campos
      usuarios.push({ correo, contrasena, nombre, apellido, telefono, genero });
      localStorage.setItem('usuarios', JSON.stringify(usuarios)); // <-- ¡Aquí se guarda!
      console.log('RegistroPage: Usuario registrado y guardado en localStorage:', { correo, contrasena });

      const alert = await this.alertController.create({
        header: '¡Registro Exitoso!',
        message: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigateByUrl('/login');
    } else {
      const alert = await this.alertController.create({
        header: 'Error de Validación',
        message: 'Por favor, completa todos los campos correctamente. Asegúrate que las contraseñas coincidan y que el teléfono sea válido.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}