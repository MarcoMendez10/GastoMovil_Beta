// src/app/nueva-carga/nueva-carga.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'; // Importa AlertController si no lo está
import { Router } from '@angular/router';
import { CargasService, CargaCombustible } from '../services/cargas.service'; // <-- ¡Importa tu servicio y la interfaz!

@Component({
  selector: 'app-nueva-carga',
  templateUrl: './nueva-carga.page.html',
  styleUrls: ['./nueva-carga.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class NuevaCargaPage implements OnInit {

  cargaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private cargasService: CargasService // <-- ¡Inyecta el servicio!
  ) {
    this.cargaForm = this.fb.group({
      fecha: [this.getCurrentDateTime(), Validators.required],
      litros: ['', [Validators.required, Validators.min(0.01)]],
      costoTotal: ['', [Validators.required, Validators.min(1)]],
      kilometraje: ['', [Validators.required, Validators.min(1)]],
      tipoCombustible: ['', Validators.required],
      estacionServicio: [''],
      notas: ['']
    });
  }

  ngOnInit() {
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async registrarCarga() {
    this.cargaForm.markAllAsTouched();

    if (this.cargaForm.valid) {
      // Casting a CargaCombustible (sin el ID, que lo añade el servicio)
      const nuevaCarga: Omit<CargaCombustible, 'id'> = this.cargaForm.value;

      // <-- ¡Aquí es donde añadimos la carga al servicio!
      this.cargasService.addCarga(nuevaCarga);

      const alert = await this.alertController.create({
        header: 'Carga Registrada',
        message: '¡Tu carga de combustible ha sido registrada con éxito!',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.cargaForm.reset();
            this.cargaForm.get('fecha')?.setValue(this.getCurrentDateTime());
            this.router.navigateByUrl('/historial'); // Redirige de vuelta al historial
          }
        }]
      });
      await alert.present();

    } else {
      console.log('Formulario de carga inválido.');
      const alert = await this.alertController.create({
        header: 'Error de Validación',
        message: 'Por favor, completa todos los campos requeridos y corrige los errores.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}