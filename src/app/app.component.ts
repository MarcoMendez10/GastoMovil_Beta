import { Component, OnInit } from '@angular/core'; // Asegúrate de importar OnInit
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    CommonModule
  ],
})
export class AppComponent implements OnInit { // Implementa OnInit

  // Declara la propiedad 'usuario' aquí
  usuario: any = {
    nombre: 'Invitado', // Valor por defecto
    apellido: '',
    correo: '',
    telefono: '',
    genero: '' // Si usas el campo género
  };

  public appPages = [
    // ... tus rutas de menú ...
    { title: 'Estadísticas', url: '/estadisticas', icon: 'stats-chart' },
    { title: 'Bencineras', url: '/bencineras', icon: 'business' },
    { title: 'Ruta Planeada', url: '/rutaplaneada', icon: 'map' },
    { title: 'Historial', url: '/historial', icon: 'time' },
    { title: 'Acerca de', url: '/acerca-de', icon: 'information-circle' },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    // Inicializa el usuario al construir el componente
    this.cargarDatosUsuario();
  }

  ngOnInit() {
    // Puedes usar ngOnInit si necesitas hacer algo después de que el componente se inicialice completamente
    // o si prefieres cargar los datos aquí en lugar del constructor.
    // this.cargarDatosUsuario(); // Otra opción para llamar a la carga de datos
  }

  private cargarDatosUsuario() {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        this.usuario = JSON.parse(usuarioStr);
      } catch (e) {
        console.error('Error al parsear datos de usuario de localStorage', e);
        // Si hay un error, resetea el usuario a valores por defecto
        this.usuario = { nombre: 'Invitado', apellido: '', correo: '', telefono: '', genero: '' };
      }
    } else {
      // Si no hay datos en localStorage, el usuario es Invitado
      this.usuario = { nombre: 'Invitado', apellido: '', correo: '', telefono: '', genero: '' };
    }
  }

  async cerrarSesionDesdeMenu() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cerrar sesión cancelado');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            // Limpia los datos del usuario de localStorage al cerrar sesión
            localStorage.removeItem('usuario');
            this.router.navigateByUrl('/login');
            console.log('Sesión cerrada.');
          },
        },
      ],
    });

    await alert.present();
  }
}