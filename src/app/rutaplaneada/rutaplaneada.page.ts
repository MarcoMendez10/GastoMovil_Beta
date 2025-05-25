import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-rutaplaneada',
  templateUrl: './rutaplaneada.page.html',
  styleUrls: ['./rutaplaneada.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RutaplaneadaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
