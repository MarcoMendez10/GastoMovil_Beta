// src/app/mi-auto/mi-auto.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// ¡Asegúrate de importar FormBuilder, FormGroup, Validators y ReactiveFormsModule!
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { AutoService, Auto } from '../services/auto.service';

@Component({
  selector: 'app-mi-auto',
  templateUrl: './mi-auto.page.html',
  styleUrls: ['./mi-auto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule] // <-- ¡Asegúrate de ReactiveFormsModule!
})
export class MiAutoPage implements OnInit {

  // ¡Asegúrate de que esta línea esté presente para declarar autoForm!
  autoForm: FormGroup;
  autoGuardado: boolean = false;

  constructor(
    // ¡Asegúrate de que FormBuilder esté inyectado aquí!
    private fb: FormBuilder,
    private autoService: AutoService,
    private alertController: AlertController
  ) {
    // ¡Asegúrate de que autoForm se inicialice aquí con FormBuilder!
    this.autoForm = this.fb.group({
      nombre: ['', Validators.required],
      modeloAuto: ['', Validators.required],
      descripcion: [''],
      tipoCombustible: ['', Validators.required],
      capacidadEstanque: ['', [Validators.required, Validators.min(1)]],
      marca: ['', Validators.required],
      modelo: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 2)]],
      patente: ['', Validators.required],
      polizaSeguro: [''],
      revisionTecnica: [''],
      activo: [true]
    });
  }

  ngOnInit() {
    this.autoService.auto$.subscribe(auto => {
      if (auto) {
        this.autoForm.patchValue(auto);
        this.autoGuardado = true;
      } else {
        this.autoForm.reset({ activo: true });
        this.autoGuardado = false;
      }
    });
  }

  async guardarDatosAuto() {
    this.autoForm.markAllAsTouched();

    if (this.autoForm.valid) {
      const autoData: Auto = this.autoForm.value;
      this.autoService.guardarAuto(autoData);

      const alert = await this.alertController.create({
        header: '¡Éxito!',
        message: 'La información de tu auto ha sido guardada con éxito.',
        buttons: ['OK']
      });
      await alert.present();
      this.autoGuardado = true;
    } else {
      const alert = await this.alertController.create({
        header: 'Error de Validación',
        message: 'Por favor, rellena todos los campos requeridos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async eliminarDatosAuto() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar todos los datos de tu auto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.autoService.eliminarAuto();
            this.autoForm.reset({ activo: true });
            this.autoGuardado = false;
            this.alertController.create({
              header: 'Eliminado',
              message: 'Los datos de tu auto han sido eliminados.',
              buttons: ['OK']
            }).then(a => a.present());
          }
        }
      ]
    });
    await alert.present();
  }
}