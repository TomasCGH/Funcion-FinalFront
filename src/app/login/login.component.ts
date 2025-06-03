import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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

  seleccionarOrg(org: any): void {
    localStorage.setItem('orgSeleccionada', JSON.stringify(org));
    this.router.navigate(['/dashboard']); // Cambia la ruta si quieres ir directo a "registrar-encargado"
  }

  irAAdmin(): void {
    this.router.navigate(['/admin-login']); // Esta es opcional, si tienes login separado para admins
  }
}
