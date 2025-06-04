// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrarEncargadoComponent } from './registrar-encargado/registrar-encargado.component';
import { RegistroGuard } from './guards/registro.guard';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    RegistrarEncargadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    RegistroGuard
  ],
  bootstrap: [LoginComponent]  // o el componente raíz que estés usando
})
export class AppModule { }
