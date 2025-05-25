// src/app/services/auto.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz para definir la estructura de los datos del auto
export interface Auto { // <-- ¡Asegúrate de que 'export' esté aquí!
  nombre: string;
  modeloAuto: string;
  descripcion: string;
  tipoCombustible: string;
  capacidadEstanque: number;
  marca: string;
  modelo: number;
  patente: string;
  polizaSeguro: string;
  revisionTecnica: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AutoService { // <-- ¡Asegúrate de que 'export' esté aquí y el nombre sea 'AutoService'!
  private _auto = new BehaviorSubject<Auto | null>(null);
  public readonly auto$: Observable<Auto | null> = this._auto.asObservable();

  constructor() {
    this.loadAuto();
  }

  private loadAuto() {
    const storedAuto = localStorage.getItem('miAuto');
    if (storedAuto) {
      this._auto.next(JSON.parse(storedAuto));
    }
  }

  private saveAuto(auto: Auto | null) {
    if (auto) {
      localStorage.setItem('miAuto', JSON.stringify(auto));
    } else {
      localStorage.removeItem('miAuto');
    }
  }

  guardarAuto(auto: Auto) {
    this._auto.next(auto);
    this.saveAuto(auto);
  }

  getAutoActual(): Auto | null {
    return this._auto.getValue();
  }

  eliminarAuto() {
    this._auto.next(null);
    this.saveAuto(null);
  }
}