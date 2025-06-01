// src/app/dashboard/dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,          // ← Marca el componente como standalone
  imports: [
    CommonModule,
    RouterModule              // ← Importa RouterModule para habilitar <a routerLink="...">
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  // ← Debe ser "styleUrls" (no "styleUrl")
})
export class DashboardComponent {
  // Aquí va lógica si la necesitas
}
