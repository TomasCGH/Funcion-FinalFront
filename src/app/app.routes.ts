import { Routes } from '@angular/router';
import { RegistrarClienteComponent } from './registrar-cliente/registrar-cliente.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';


export const routes: Routes = [
  // 🚀 Ahora el login es la página inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarClienteComponent },
  { path: 'dashboard', component: DashboardComponent },

  // opcional: ruta comodín para 404
  { path: '**', redirectTo: 'login' }
];
