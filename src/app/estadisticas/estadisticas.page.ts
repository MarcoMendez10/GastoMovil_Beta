// src/app/estadisticas/estadisticas.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Asegúrate de que esté aquí

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // FormsModule no es estrictamente necesario aquí si no hay forms, pero no molesta.
})
export class EstadisticasPage implements OnInit {
  constructor() { }
  ngOnInit() { }
}
