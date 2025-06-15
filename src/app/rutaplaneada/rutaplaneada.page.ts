// src/app/rutaplaneada/rutaplaneada.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-rutaplaneada',
  templateUrl: './rutaplaneada.page.html',
  styleUrls: ['./rutaplaneada.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule 
  ]
})
export class RutaplaneadaPage implements OnInit {

  origen: string = '';
  destino: string = '';
  rutaEncontrada: any | null = null; 
  mensajeError: string = '';

  constructor() { }

  ngOnInit() {
   
  }

  async buscarRuta() {
    this.mensajeError = ''; 
    this.rutaEncontrada = null; 

    if (!this.origen || !this.destino) {
      this.mensajeError = 'Por favor, ingresa tanto el origen como el destino.';
      return;
    }

    // --- SIMULACIÓN DE LLAMADA A LA API DE GOOGLE MAPS ---
    // En una aplicación real, aquí harías una llamada a tu backend
    // o directamente a la API de Google Directions (con los riesgos de seguridad y cuota).
    // Ejemplo de cómo se vería una llamada HTTP real (requeriría HttpClient en el constructor):
    // this.http.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.origen}&destination=${this.destino}&key=TU_API_KEY`)

    console.log(`Buscando ruta de ${this.origen} a ${this.destino}...`);

    try {
      // Simulación de una respuesta de la API después de un pequeño retraso
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula un retraso de red

      

      // Ejemplo de una respuesta simulada exitosa:
      this.rutaEncontrada = {
        origen: this.origen,
        destino: this.destino,
        distancia: '18.7 km',
        duracion: '20 min',
        resumen: 'Autop. Central/Ruta 5',
        mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(this.origen)}/${encodeURIComponent(this.destino)}`
      };

      // Ejemplo de una respuesta simulada con otro destino
      if (this.destino.toLowerCase().includes('viña del mar')) {
          this.rutaEncontrada = {
            origen: this.origen,
            destino: this.destino,
            distancia: '120 km',
            duracion: '1 h 30 min',
            resumen: 'Ruta 68',
            notasAdicionales: 'Considerar peajes.',
            mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(this.origen)}/${encodeURIComponent(this.destino)}`
          };
      } else if (this.destino.toLowerCase().includes('error')) {
          throw new Error('No se pudo encontrar la ruta para el destino especificado.');
      }


    } catch (error: any) {
      this.mensajeError = `Error al buscar la ruta: ${error.message || 'Error desconocido'}`;
      console.error('Error al buscar la ruta:', error);
    }
  }

  verEnGoogleMaps() {
    if (this.rutaEncontrada && this.rutaEncontrada.mapUrl) {
      window.open(this.rutaEncontrada.mapUrl, '_system'); // Abre en el navegador del sistema
    }
  }
}