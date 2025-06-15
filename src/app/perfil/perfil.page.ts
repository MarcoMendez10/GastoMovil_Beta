// src/app/perfil/perfil.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ya debería estar
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Añadir ReactiveFormsModule
import { IonicModule, AlertController, ToastController, LoadingController, NavController } from '@ionic/angular'; // ¡IMPORTAR IONICMODULE AQUÍ!

// Asegúrate de que el FormBuilder, FormGroup, Validators, etc. también estén importados
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true, 
  imports: [ 
    IonicModule, 
    CommonModule,
    FormsModule, 
    ReactiveFormsModule 
  ]
})
export class PerfilPage implements OnInit {

  usuario: any = {
    nombre: 'Nombre Usuario',
    apellido: 'Apellido Usuario',
    correo: 'usuario@ejemplo.com',
    telefono: '+56912345678',
    fotoPerfil: ''
  };

  profileForm: FormGroup;
  passwordForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
  ) {
    this.profileForm = this.fb.group({
      correo: [this.usuario.correo, [Validators.required, Validators.email]],
      telefono: [this.usuario.telefono, [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    console.log('Cargando datos del usuario...');
    this.usuario.fotoPerfil = 'https://gravatar.com/avatar/HASH?s=200&d=identicon';
    this.profileForm.patchValue({
        correo: this.usuario.correo,
        telefono: this.usuario.telefono
    });
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadProfilePicture() {
    if (!this.selectedFile) {
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Subiendo foto...',
    });
    await loading.present();

    try {
      const toast = await this.toastController.create({
        message: 'Foto de perfil actualizada.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al subir la foto.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      console.error('Error uploading profile picture:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      const toast = await this.toastController.create({
        message: 'Por favor, corrige los errores del formulario.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando perfil...',
    });
    await loading.present();

    try {
      const { correo, telefono } = this.profileForm.value;
      
      if (this.selectedFile) {
        await this.uploadProfilePicture();
      }

      const toast = await this.toastController.create({
        message: 'Perfil actualizado con éxito.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al actualizar el perfil.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      console.error('Error saving profile:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      const toast = await this.toastController.create({
        message: 'Por favor, revisa las contraseñas.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cambiando contraseña...',
    });
    await loading.present();

    try {
      const { currentPassword, newPassword } = this.passwordForm.value;

      const toast = await this.toastController.create({
        message: 'Contraseña cambiada con éxito.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.passwordForm.reset();
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cambiar la contraseña. Contraseña actual incorrecta o problema de conexión.';
      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
      console.error('Error changing password:', error);
    } finally {
      await loading.dismiss();
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmNewPassword = control.get('confirmNewPassword')?.value;

    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      return { mismatch: true };
    }
    return null;
  }
}