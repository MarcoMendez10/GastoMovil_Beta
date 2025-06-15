// src/app/bencineras/bencineras.page.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController, Platform } from '@ionic/angular';

// Importar Geolocation de Capacitor
import { Geolocation, Position } from '@capacitor/geolocation'; 

// Importar Loader de Google Maps API
import { Loader } from '@googlemaps/js-api-loader';

// Importar HttpClientModule y HttpClient
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

// Definir la interfaz para las estaciones de gasolina
interface GasStation {
  id: string;
  name: string;
  address: string;
  price: number;
  latitude: number;
  longitude: number;
  distance?: number;
  fuelType: string;
}

@Component({
  selector: 'app-bencineras',
  templateUrl: './bencineras.page.html',
  styleUrls: ['./bencineras.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule // ¡Necesario para hacer peticiones HTTP!
  ]
})
export class BencinerasPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('map', { static: false }) mapElement!: ElementRef; 

  map: google.maps.Map | undefined;
  userMarker: google.maps.Marker | undefined;
  stationMarkers: google.maps.Marker[] = [];

  userLocation: { lat: number, lng: number } | null = null;
  loadingMap: boolean = true;
  mapLoaded: boolean = false; 
  loadingStations: boolean = false; 
  allGasStations: GasStation[] = [];
  filteredGasStations: GasStation[] = [];

  defaultCenter = { lat: -33.4489, lng: -70.6693 }; // Santiago de Chile

  private cneApiUrl = '/api-cne/v4/estaciones'; // Apunta al proxy local
  
  // ¡TU TOKEN DE ACCESO DE LA CNE ACTUALIZADO!
  private apiAccessToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLmNuZS5jbC9hcGkvbG9naW4iLCJpYXQiOjE3NDk3ODI3MjcsImV4cCI6MTc0OTc4NjMyNywibmJmIjoxNzQ5NzgyNzI3LCJqdGkiOiJFbEZvMUlWV1h4dEtQM3R3Iiwic3ViIjoiMzM3OCIsInBydiI6IjIzYmQ1Y2E4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ffb096stUSQiDm4tYhhYXt4XwrQnmi1I5LWHZrnV148'; 
  
  // Tu clave de Google Maps API (la misma que en index.html)
  private googleMapsApiKey: string = 'AIzaSyDIU2Fd7nEdDX16X4JvdGvySN9Mh3fy14Y';


  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private platform: Platform, // Inyectar Platform
    private http: HttpClient // ¡Inyectar HttpClient!
  ) {}

  ngOnInit() {
    // La inicialización del mapa y la obtención de datos se manejan en ngAfterViewInit.
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit ejecutado.');
    this.pollForMapElement(30, 50); // Intenta hasta 30 veces, cada 50ms
  }

  // Intenta acceder al mapElement.nativeElement de forma recursiva con retries
  private pollForMapElement(retries: number, delayMs: number) {
    requestAnimationFrame(() => { 
      if (this.mapElement && this.mapElement.nativeElement) {
        const element = this.mapElement.nativeElement;
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
            console.log('mapElement.nativeElement disponible y visible. Iniciando carga del mapa.');
            if (this.platform.is('capacitor') || this.platform.is('desktop') || this.platform.is('mobileweb')) {
              this.loadMap(); 
            } else {
              console.warn('Google Maps API no disponible en esta plataforma.');
              this.loadingMap = false;
              this.mapLoaded = false;
            }
        } else if (retries > 0) {
            console.warn(`mapElement.nativeElement existe pero tiene dimensiones cero (${element.offsetWidth}x${element.offsetHeight}). Reintentando... (${retries} intentos restantes)`);
            setTimeout(() => {
                this.pollForMapElement(retries - 1, delayMs);
            }, delayMs);
        } else {
            console.error('ERROR CRÍTICO: mapElement.nativeElement existe pero no tiene dimensiones visibles (width/height). Asegúrate de que el div #map tiene CSS que le da un tamaño.');
            this.loadingMap = false;
            this.mapLoaded = false;
            this.presentToast('Error interno: El contenedor del mapa no tiene un tamaño visible. Revisa el CSS.', 'danger');
        }
      } else if (retries > 0) {
        console.warn(`mapElement.nativeElement no disponible. Reintentando... (${retries} intentos restantes)`);
        setTimeout(() => {
          this.pollForMapElement(retries - 1, delayMs);
        }, delayMs);
      } else {
        console.error('ERROR CRÍTICO: mapElement.nativeElement no disponible después de múltiples reintentos. Asegúrate de que el div #map está en el HTML.');
        this.loadingMap = false;
        this.mapLoaded = false;
        this.presentToast('Error interno: El contenedor del mapa no se pudo encontrar en el HTML.', 'danger');
      }
    });
  }

  ngOnDestroy() {
    this.stationMarkers.forEach(marker => marker.setMap(null));
    if (this.userMarker) {
      this.userMarker.setMap(null);
    }
    this.map = undefined;
  }

  // --- Carga y Inicialización del Mapa ---
  async loadMap() {
    this.loadingMap = true;
    this.mapLoaded = false;
    
    if (!this.mapElement || !this.mapElement.nativeElement || this.mapElement.nativeElement.offsetWidth === 0 || this.mapElement.nativeElement.offsetHeight === 0) {
        console.error('Error: El contenedor del mapa (mapElement.nativeElement) no está disponible o no tiene dimensiones en loadMap. Retornando.');
        this.loadingMap = false;
        this.mapLoaded = false;
        this.presentToast('Error interno: El contenedor del mapa no está listo para mostrar el mapa.', 'danger');
        return; 
    }
    console.log('Iniciando carga de Google Maps Loader...');
    const loader = new Loader({
      apiKey: this.googleMapsApiKey, 
      version: 'weekly',
      libraries: ['places']
    });

    try {
      await loader.load();
      console.log('Google Maps Loader cargado exitosamente.');
      
      if (this.map) { 
        console.log('Mapa ya inicializado, no se inicializa de nuevo.');
        this.mapLoaded = true;
        this.loadingMap = false;
        return;
      }
      
      const mapOptions: google.maps.MapOptions = {
        center: this.defaultCenter,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false
      };

      console.log('Inicializando google.maps.Map...');
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.mapLoaded = true;
      this.loadingMap = false;
      console.log('Mapa de Google inicializado exitosamente.');

      await this.getCurrentUserLocation();
      if (this.userLocation) {
        await this.loadGasStations(); 
      }

    } catch (error) {
      console.error('Error al cargar Google Maps API:', error);
      this.loadingMap = false;
      this.mapLoaded = false;
      this.presentToast('Error al cargar el mapa. Verifica tu clave de API o conexión a internet.', 'danger');
    }
  }

  // --- Obtener la Ubicación del Usuario ---
  async getCurrentUserLocation() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo tu ubicación...',
      duration: 5000,
      spinner: 'dots'
    });
    await loading.present();

    try {
      const position: Position = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: true });
      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.map?.setCenter(this.userLocation);
      this.map?.setZoom(14);

      if (this.userMarker) {
        this.userMarker.setMap(null);
      }

      this.userMarker = new google.maps.Marker({
        position: this.userLocation,
        map: this.map,
        title: 'Tu Ubicación',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      this.presentToast('Ubicación obtenida.', 'success');

    } catch (error: any) {
      console.error('Error al obtener la ubicación:', error);
      this.presentToast('No se pudo obtener tu ubicación. Asegúrate de tener el GPS activado y los permisos concedidos.', 'danger');
      this.userLocation = null;
    } finally {
      await loading.dismiss();
    }
  }

  // --- Encontrar mi ubicación en el mapa (botón de la toolbar) ---
  async findMeOnMap() {
    await this.getCurrentUserLocation();
    if (this.userLocation) {
      this.map?.setCenter(this.userLocation);
      this.map?.setZoom(14);
      this.presentToast('Mapa centrado en tu ubicación.', 'primary');
      await this.loadGasStations();
    } else {
      this.presentToast('No se pudo centrar el mapa, ubicación no disponible.', 'warning');
    }
  }

  // --- Carga de Bencineras (¡Implementación usando la API de CNE!) ---
  async loadGasStations() {
    if (!this.userLocation) {
      this.presentToast('Necesitamos tu ubicación para buscar bencineras.', 'warning');
      return;
    }
    
    this.loadingStations = true;
    this.filteredGasStations = [];
    this.stationMarkers.forEach(marker => marker.setMap(null));
    this.stationMarkers = [];

    const loading = await this.loadingController.create({
      message: 'Buscando bencineras...',
      duration: 10000,
      spinner: 'dots'
    });
    await loading.present();

    try {
      if (!this.apiAccessToken || this.apiAccessToken.length < 100) { 
        this.presentToast('Error: Token de acceso de la API de CNE no configurado o inválido. Se cargarán datos de ejemplo.', 'danger');
        console.error('API Token is missing, truncated, or placeholder for CNE API.');
        this.loadSimulatedGasStationsFallback(); 
        await loading.dismiss();
        this.loadingStations = false;
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.apiAccessToken}`,
        'Content-Type': 'application/json'
      });

      const apiUrl = `${this.cneApiUrl}?lat=${this.userLocation.lat}&lon=${this.userLocation.lng}&radio=20`; 
      
      console.log('Realizando petición a API CNE:', apiUrl);
      const realApiData: any[] = (await this.http.get<any[]>(apiUrl, { headers: headers }).toPromise()) || [];
      
      console.log('Datos de API CNE recibidos:', realApiData);
      
      const fetchedStations: GasStation[] = realApiData.map(apiStation => ({
        id: apiStation.codigo_servicentro || String(apiStation.id) || 'N/A', 
        name: apiStation.nombre_marca || apiStation.name || 'Sin Nombre', 
        address: apiStation.direccion || apiStation.address || 'Sin Dirección',
        price: apiStation.precio_bencina93 || apiStation.precio_diesel || apiStation.precio || 0, 
        latitude: apiStation.latitud || apiStation.lat || 0,
        longitude: apiStation.longitud || apiStation.lon || 0, 
        fuelType: apiStation.tipo_combustible || apiStation.fuelType || 'N/A' 
      }))
      .filter(s => s.latitude !== 0 && s.longitude !== 0 && s.price > 0 && s.id !== 'N/A'); 
      
      this.allGasStations = fetchedStations;

      this.filteredGasStations = this.allGasStations
        .map(station => ({
          ...station,
          distance: this.calculateDistance(this.userLocation!.lat, this.userLocation!.lng, station.latitude, station.longitude)
        }))
        .filter(station => station.distance! <= 50)
        .sort((a, b) => a.distance! - b.distance!)
        .slice(0, 20);

      this.filteredGasStations.sort((a, b) => a.price - b.price);
        
      this.addStationMarkers();
      this.presentToast('Bencineras actualizadas desde API y mapa.', 'success');

    } catch (error: any) { 
      console.error('Error al cargar las bencineras desde la API:', error);
      this.presentToast('Error al buscar bencineras desde la API. Se cargarán datos de ejemplo.', 'danger');
      this.loadSimulatedGasStationsFallback(); 
    } finally {
      await loading.dismiss();
      this.loadingStations = false;
    }
  }

  // Función para cargar datos simulados como fallback
  private loadSimulatedGasStationsFallback() {
    this.allGasStations = [
      { id: '1', name: 'Shell - Providencia', address: 'Av. Providencia 1234', price: 1050, latitude: -33.4357, longitude: -70.6120, fuelType: 'Bencina 93' },
      { id: '3', name: 'Petrobras - Ñuñoa', address: 'Av. Irarrázaval 2500', price: 1030, latitude: -33.4680, longitude: -70.6200, fuelType: 'Bencina 93' },
      { id: '6', name: 'Petrobras - La Florida', address: 'Vicuña Mackenna 7000', price: 1020, latitude: -33.5200, longitude: -70.6000, fuelType: 'Bencina 93' },
      { id: '2', name: 'Copec - Las Condes', address: 'Av. Apoquindo 5000', price: 1080, latitude: -33.4075, longitude: -70.5750, fuelType: 'Bencina 95' },
      { id: '4', name: 'Shell - Santiago Centro', address: 'Alameda 100', price: 1070, latitude: -33.4410, longitude: -70.6480, fuelType: 'Diesel' },
      { id: '5', name: 'Copec - Vitacura', address: 'Av. Vitacura 9000', price: 1095, latitude: -33.3900, longitude: -70.5500, fuelType: 'Bencina 97' },
      { id: '7', name: 'Shell - Maipú', address: 'Av. Pajaritos 4500', price: 1045, latitude: -33.5100, longitude: -70.7500, fuelType: 'Bencina 95' },
      { id: '8', name: 'Copec - Puente Alto', address: 'Concha y Toro 300', price: 1010, latitude: -33.6000, longitude: -70.5700, fuelType: 'Diesel' },
      { id: '9', name: 'Shell - Independencia', address: 'Av. Independencia 500', price: 1060, latitude: -33.4200, longitude: -70.6400, fuelType: 'Bencina 97' },
      { id: '10', name: 'Petrobras - San Miguel', address: 'Gran Avenida 6000', price: 1025, latitude: -33.5000, longitude: -70.6500, fuelType: 'Bencina 93' },
    ];
    if (this.userLocation) {
      this.filteredGasStations = this.allGasStations
        .map(station => ({
          ...station,
          distance: this.calculateDistance(this.userLocation!.lat, this.userLocation!.lng, station.latitude, station.longitude)
        }))
        .sort((a, b) => a.distance! - b.distance!)
        .slice(0, 10);
      this.filteredGasStations.sort((a, b) => a.price - b.price);
      this.addStationMarkers();
    }
  }

  // --- Añadir Marcadores de Bencineras al Mapa ---
  addStationMarkers() {
    // Código de marcadores de mapa (requiere Google Maps API)
    // Este código fue parte de una versión anterior que usaba el mapa de Google.
    // Si no estás usando Google Maps API en esta fase, este método puede quedar vacío o eliminarse.
    // Por ahora lo mantendré para compatibilidad con la estructura anterior.
    console.log('addStationMarkers: Este método necesita la API de Google Maps para funcionar.');
  }

  // --- Centrar el Mapa en una Estación Específica ---
  centerMapOnStation(station: GasStation) {
    console.log('centerMapOnStation: Este método necesita la API de Google Maps para funcionar.');
  }

  // --- Función para Calcular Distancia (Haversine formula) ---
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // --- Funciones de Utilidad para Toast y Loading ---
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
