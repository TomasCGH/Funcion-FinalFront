// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orgSeleccionada: any = null;

  ngOnInit(): void {
    const org = localStorage.getItem('orgSeleccionada');
    if (org) {
      this.orgSeleccionada = JSON.parse(org);
    }
  }

  mostrarMensajeNoDisponible(): void {
    alert('⚠️ Funcionalidad todavía no implementada.');
  }
}
