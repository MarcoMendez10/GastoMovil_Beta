// src/app/historial/historial.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CargasService, CargaCombustible } from '../services/cargas.service';
import { Subscription } from 'rxjs'; // <-- Asegúrate de que Subscription esté importado

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HistorialPage implements OnInit, OnDestroy { // <-- Asegúrate de implementar OnDestroy

  // ¡Asegúrate de que estas dos líneas estén presentes y correctas!
  cargas: CargaCombustible[] = []; // <-- Variable para almacenar las cargas (¡DEBE ESTAR AQUÍ!)
  private cargasSubscription: Subscription | undefined; // Para manejar la suscripción

  constructor(
    private router: Router,
    private cargasService: CargasService // <-- Asegúrate de que el servicio esté inyectado
  ) { }

  ngOnInit() {
    // ¡Asegúrate de que esta suscripción esté aquí!
    this.cargasSubscription = this.cargasService.cargas$.subscribe(cargasActualizadas => {
      this.cargas = [...cargasActualizadas].reverse(); // Asigna y opcionalmente invierte
    });
  }

  // ¡Asegúrate de que este método esté aquí para evitar fugas de memoria!
  ngOnDestroy() {
    if (this.cargasSubscription) {
      this.cargasSubscription.unsubscribe();
    }
  }

  goToNuevaCarga() {
    this.router.navigateByUrl('/nueva-carga');
  }

  // ¡Asegúrate de que este método esté aquí si lo usas en el HTML!
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  // Opcional: deleteCarga si lo estás usando
}