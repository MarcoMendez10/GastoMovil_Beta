// src/app/services/menu-filter.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuFilterService {
  // BehaviorSubject para almacenar el término de búsqueda actual
  // y notificar a los suscriptores cuando cambie.
  private searchTermSubject = new BehaviorSubject<string>('');

  // Observable público para que otros componentes puedan suscribirse
  // y reaccionar a los cambios del término de búsqueda.
  public searchTerm$: Observable<string> = this.searchTermSubject.asObservable();

  constructor() { }

  /**
   * Actualiza el término de búsqueda y notifica a todos los suscriptores.
   * @param term El nuevo término de búsqueda.
   */
  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }
}
