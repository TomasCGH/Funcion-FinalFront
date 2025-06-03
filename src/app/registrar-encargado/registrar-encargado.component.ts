import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { EncargadoService, EncargadoDTO } from '../servicios/encargado.service';

@Component({
  selector: 'app-registrar-encargado',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, FontAwesomeModule],
  templateUrl: './registrar-encargado.component.html',
  styleUrls: ['./registrar-encargado.component.css']
})
export class RegistrarEncargadoComponent implements OnInit {
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  encargado = {
    nombre: '',
    username: '',
    contrasena: '',
    confirmarContrasena: '',
    prefijoTelefono: '',
    telefono: '',
    tipoDocumento: '',
    numeroDocumento: ''
  };

  organizacionNombre: string = '';
  mensaje = '';
  mensajeTipo: 'exito' | 'error' | '' = '';
  cargando = false;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private encargadoService: EncargadoService
  ) {}

  ngOnInit(): void {
    const orgStr = localStorage.getItem('orgSeleccionada');
    if (orgStr) {
      const orgObj = JSON.parse(orgStr);
      this.organizacionNombre = orgObj.nombre?.trim() || '';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  contrasenasCoinciden(): boolean {
    return this.encargado.contrasena === this.encargado.confirmarContrasena;
  }

  registrarEncargado(formulario: NgForm): void {
    this.mensaje = '';
    this.mensajeTipo = '';

    if (!this.contrasenasCoinciden()) {
      this.mensaje = '❌ Las contraseñas no coinciden.';
      this.mensajeTipo = 'error';
      return;
    }

    this.cargando = true;

    const encargadoDTO: EncargadoDTO = {
      nombre: this.encargado.nombre.trim(),
      username: this.encargado.username.trim(),
      contrasena: this.encargado.contrasena, // 👈 no usar .trim()
      prefijoTelefono: this.encargado.prefijoTelefono.trim(),
      telefono: this.encargado.telefono.trim(),
      tipoDocumento: this.encargado.tipoDocumento.trim().toUpperCase(),
      numeroDocumento: this.encargado.numeroDocumento.trim(),
      organizacion: this.organizacionNombre
    };

    this.encargadoService.registrarEncargado(encargadoDTO).subscribe({
      next: (respuesta: string) => {
        this.mensaje = '✅ ' + respuesta;
        this.mensajeTipo = 'exito';
        formulario.resetForm();
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error: any) => {
        this.cargando = false;

        if (typeof error?.error === 'string') {
          this.mensaje = '❌ ' + error.error;
        } else if (error?.error?.mensaje) {
          this.mensaje = '❌ ' + error.error.mensaje;
        } else {
          this.mensaje = '❌ Error desconocido. Intenta nuevamente.';
        }

        this.mensajeTipo = 'error';
        console.error('❌ Error desde backend:', error);
      }
    });
  }

  irAlLogin(): void {
    this.router.navigate(['/login']);
  }

  irAOrganizacion(): void {
    this.router.navigate(['/organizacion']);
  }
}
