// src/app/login/login.component.ts

import { Component, OnInit } from '@angular/core';      // ← Importar OnInit
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {         // ← Implementa OnInit
  organizaciones = [
    {
      nombre: 'IMMER',
      imagen: 'assets/immer.png',
      dominio: '@immer.com'
    },
    {
      nombre: 'INDER',
      imagen: 'assets/inder.png',
      dominio: '@inder.gov.co'
    },
    {
      nombre: 'OLIMPO',
      imagen: 'assets/Olimpo.png',
      dominio: '@olimpo.org'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cada vez que se muestre el login, eliminamos cualquier org almacenada
    localStorage.removeItem('orgSeleccionada');
  }

  seleccionarOrg(org: any): void {
    // Guardamos la organización elegida en localStorage
    localStorage.setItem('orgSeleccionada', JSON.stringify(org));
    // Redirigimos a la pantalla de Dashboard
    this.router.navigate(['/dashboard']);
  }

  irAAdmin(): void {
    // Si tienes una ruta de login para administradores, navega allí;
    // de lo contrario, puedes eliminar este método o dejarlo vacío.
    this.router.navigate(['/admin-login']);
  }
}
