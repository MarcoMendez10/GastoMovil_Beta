import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule para [(ngModel)]
import { IonicModule } from '@ionic/angular'; // <-- Asegúrate de que IonicModule esté aquí
import { RouterModule } from '@angular/router'; // <-- Importa RouterModule para routerLink

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule, // ¡Importante!
    RouterModule // Para el enlace a la versión pro
  ]
})
export class CalculadoraPage implements OnInit {

  // Objeto para almacenar los valores de entrada de la calculadora
  calculo = {
    distancia: null as number | null, // km
    precioLitro: null as number | null, // CLP por litro
    consumo: null as number | null // km por litro
  };

  // Variable para almacenar el resultado del cálculo
  gastoEstimado: number | null = null; // CLP

  constructor() { }

  ngOnInit() {
  }

  // Método para realizar el cálculo del gasto
  calcularGasto() {
    const { distancia, precioLitro, consumo } = this.calculo;

    // Validación básica para asegurar que los campos no estén vacíos y sean números válidos
    if (distancia === null || precioLitro === null || consumo === null ||
        isNaN(distancia) || isNaN(precioLitro) || isNaN(consumo) ||
        distancia <= 0 || precioLitro <= 0 || consumo <= 0) {
      alert('Por favor, ingresa valores válidos y positivos en todos los campos.');
      this.gastoEstimado = null; // Resetea el resultado si hay un error
      return;
    }

    // Fórmula: (Distancia / Consumo) * PrecioPorLitro
    // Ejemplo: (100 km / 10 km/L) * $1000/L = $10 * $1000 = $10000
    this.gastoEstimado = (distancia / consumo) * precioLitro;

    // Opcional: Redondear a un número entero o a dos decimales si se prefiere
    this.gastoEstimado = Math.round(this.gastoEstimado);

    console.log('Distancia:', distancia, 'km');
    console.log('Precio por Litro:', precioLitro, 'CLP/L');
    console.log('Consumo:', consumo, 'km/L');
    console.log('Gasto Estimado:', this.gastoEstimado, 'CLP');
  }

}