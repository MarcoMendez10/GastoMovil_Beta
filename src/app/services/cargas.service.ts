// src/app/services/cargas.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define una interfaz para la estructura de una carga de combustible
export interface CargaCombustible { // <--- ¡Asegúrate de que 'export' esté aquí!
  fecha: string;
  litros: number;
  costoTotal: number;
  kilometraje: number;
  tipoCombustible: string;
  estacionServicio?: string; // Opcional
  notas?: string; // Opcional
  id: string; // Un identificador único para cada carga
}

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class CargasService { // <--- ¡Asegúrate de que 'export' esté aquí!
  // BehaviorSubject mantiene el estado actual y emite nuevas cargas
  private _cargas = new BehaviorSubject<CargaCombustible[]>([]);
  // Observable para que otros componentes se suscriban a los cambios
  public readonly cargas$: Observable<CargaCombustible[]> = this._cargas.asObservable();

  constructor() {
    // Opcional: Cargar cargas iniciales desde el almacenamiento local al iniciar el servicio
    this.loadCargas();
  }

  // Método para cargar cargas desde localStorage (simulación de persistencia)
  private loadCargas() {
    const storedCargas = localStorage.getItem('cargasCombustible');
    if (storedCargas) {
      this._cargas.next(JSON.parse(storedCargas));
    } else {
      // Si no hay cargas guardadas, puedes inicializar con algunas cargas de ejemplo
      this._cargas.next([
        { id: '1', fecha: '2025-05-18T10:30', litros: 45, costoTotal: 48000, kilometraje: 120500, tipoCombustible: 'bencina95', estacionServicio: 'Shell', notas: 'Primer llenado importante' },
        { id: '2', fecha: '2025-05-10T15:00', litros: 30, costoTotal: 32500, kilometraje: 119800, tipoCombustible: 'bencina93', estacionServicio: 'Copec', notas: 'Viaje corto' },
        { id: '3', fecha: '2025-05-01T08:00', litros: 50, costoTotal: 53000, kilometraje: 119000, tipoCombustible: 'bencina97', estacionServicio: 'Petrobras' }
      ]);
    }
  }

  // Método para guardar las cargas en localStorage
  private saveCargas(cargas: CargaCombustible[]) {
    localStorage.setItem('cargasCombustible', JSON.stringify(cargas));
  }

  // Método para añadir una nueva carga
  addCarga(nuevaCarga: Omit<CargaCombustible, 'id'>) {
    const currentCargas = this._cargas.getValue();
    const id = Date.now().toString(); // Generar un ID simple
    const cargaConId = { ...nuevaCarga, id };
    const updatedCargas = [...currentCargas, cargaConId];
    this._cargas.next(updatedCargas); // Emite la nueva lista de cargas
    this.saveCargas(updatedCargas); // Guarda en localStorage
  }

  // Opcional: Método para obtener una carga por su ID
  getCargaById(id: string): CargaCombustible | undefined {
    return this._cargas.getValue().find(carga => carga.id === id);
  }

  // Opcional: Método para eliminar una carga
  deleteCarga(id: string) {
    const currentCargas = this._cargas.getValue();
    const updatedCargas = currentCargas.filter(carga => carga.id !== id);
    this._cargas.next(updatedCargas);
    this.saveCargas(updatedCargas);
  }
}