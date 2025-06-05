// src/app/registrar-encargado/registrar-encargado.component.ts

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

  irAOrganizacion(): void {
    this.router.navigate(['/login']);
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
      contrasena: this.encargado.contrasena, // no usar .trim() aquí
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

  // ——— VALIDACIONES “keypress” y “paste” ———

  /**
   * Permitir sólo letras (incluyendo Ñ/ñ y vocales acentuadas) y espacios.
   * Para el campo “nombre”.
   */
  soloLetrasKeypress(event: KeyboardEvent) {
    const char = event.key;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]$/;
    if (!regex.test(char)) {
      event.preventDefault();
    }
  }
  soloLetrasPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') || '';
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    if (!regex.test(text)) {
      event.preventDefault();
    }
  }

  /**
   * Username:
   * - sólo letras (A–Z, a–z, Ñ/ñ), dígitos, punto o guión bajo
   * - sin espacios
   * - no puede empezar con “.” o “_”
   * - no puede terminar con “.” o “_”
   * - no puede contener “..” ni “__” en ninguna parte.
   */
  validarUsernameKeypress(event: KeyboardEvent) {
    const char = event.key;
    const current: string = this.encargado.username;
    const newValue = current + char;

    // 1) Primera posición no puede ser punto ni guión bajo
    if (current.length === 0 && (char === '.' || char === '_')) {
      event.preventDefault();
      return;
    }

    // 2) Permitir sólo letras (A–Z, a–z, Ñ/ñ), dígitos, punto o guión bajo
    const allowed = /^[A-Za-z0-9._Ññ]$/;
    if (!allowed.test(char)) {
      event.preventDefault();
      return;
    }

    // 3) No permitir “..” ni “__”
    if (newValue.endsWith('..') || newValue.endsWith('__')) {
      event.preventDefault();
      return;
    }

    // 4) Si el usuario está tratando de terminar con “.” o “_”, lo permitimos tipear
    //    pero luego al enviar el formulario se validará. (Aquí no bloqueamos ese caso)
  }
  bloquearPasteUsername(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') || '';
    // • Primer caracter: letra (A–Z, a–z, Ñ/ñ) o dígito.
    // • No espacios.
    // • No puntos/guiones bajos al inicio o final.
    // • No “..” ni “__” en toda la cadena.
    const valid = /^[A-Za-z0-9Ññ](?!.*[._]{2})[A-Za-z0-9._Ññ]*[A-Za-z0-9Ññ]$/;
    if (!valid.test(text)) {
      event.preventDefault();
    }
  }

  /**
   * Documento: sólo dígitos y no puede iniciar en “0”.
   */
  soloNumerosKeypress(event: KeyboardEvent) {
    const char = event.key;
    const current: string = this.encargado.numeroDocumento;

    // 1) Si no es dígito, bloquear.
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }
    // 2) Primera posición no puede ser “0”.
    if (current.length === 0 && char === '0') {
      event.preventDefault();
      return;
    }
  }
  soloNumerosPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') || '';
    // Solo dígitos y no empieza con “0”
    if (!/^[1-9][0-9]*$/.test(text)) {
      event.preventDefault();
    }
  }

  /**
   * Prefijo: debe ser exactamente “+57”.
   *   - Primera pulsación: sólo “+”
   *   - Segunda: sólo “5”
   *   - Tercera: sólo “7”
   *   - No permitir longitud > 3
   *   - Si el contenido actual NO coincide con el inicio de "+57",
   *     solo permitimos reiniciar con “+”.
   */
  validarPrefijoKeypress(event: KeyboardEvent) {
    const char = event.key;
    const current: string = this.encargado.prefijoTelefono;
    const newValue = current + char;

    // Si newValue no coincide con ningún prefijo de "+57", solo permitimos "+" para reiniciar:
    if (!"+57".startsWith(newValue)) {
      if (char === "+") {
        // aceptamos "+" y el usuario reiniciará el valor
        return;
      }
      event.preventDefault();
      return;
    }

    // Si newValue sí coincide con inicio de "+57", entonces forzamos la secuencia:
    switch (current.length) {
      case 0:
        // "" → solo permitimos "+"
        if (char !== "+") {
          event.preventDefault();
        }
        return;
      case 1:
        // "+" → solo permitimos "5"
        if (char !== "5") {
          event.preventDefault();
        }
        return;
      case 2:
        // "+5" → solo permitimos "7"
        if (char !== "7") {
          event.preventDefault();
        }
        return;
      default:
        // Ya tiene "+57" completo (longitud 3). No permitimos más.
        event.preventDefault();
        return;
    }
  }
  bloquearPastePrefijo(event: ClipboardEvent) {
    const text = event.clipboardData?.getData("text") || "";
    // Solo aceptamos exactamente "+57"
    if (text !== "+57") {
      event.preventDefault();
    }
  }

  /**
   * Teléfono: 
   * - Solo dígitos,
   * - Longitud máxima 10,
   * - Primer dígito “3”.
   */
  validarTelefonoKeypress(event: KeyboardEvent) {
    const char = event.key;
    const current: string = this.encargado.telefono;

    // 1) Solo dígitos:
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }
    // 2) Si es el primer carácter, debe ser “3”:
    if (current.length === 0 && char !== "3") {
      event.preventDefault();
      return;
    }
    // 3) No permitir más de 10 dígitos:
    if (current.length >= 10) {
      event.preventDefault();
      return;
    }
  }
  bloquearPasteTelefono(event: ClipboardEvent) {
    const text = event.clipboardData?.getData("text")?.trim() || "";
    // Debe ser 10 dígitos, empezar con “3” y solo contener números.
    if (!/^[3][0-9]{9}$/.test(text)) {
      event.preventDefault();
    }
  }
}
