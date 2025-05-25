// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // <-- ¡IMPORTA TU AUTH SERVICE AQUÍ!

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class HomePage implements OnInit {

  usuario = {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@example.com',
    telefono: '+56 9 1234 5678'
  };

  // ¡INYECTA AUTHSERVICE EN EL CONSTRUCTOR!
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  cerrarSesion() {
    console.log('HomePage: Iniciando proceso de cierre de sesión.');
    this.authService.logout(); // <-- ¡LLAMA AL MÉTODO LOGOUT DE TU AUTHSERVICE!
    // El AuthService ya redirige a /login después de eliminar el token,
    // por lo que no necesitas this.router.navigateByUrl('/login'); aquí.
  }

}