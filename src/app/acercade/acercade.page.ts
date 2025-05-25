import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acercade.page.html', 
  styleUrls: ['./acercade.page.scss'], 
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AcercaDePage implements OnInit {

  currentYear: number; 

  constructor() {
    this.currentYear = new Date().getFullYear(); 
  }

  ngOnInit() {
    
  }

}