import { Routes } from '@angular/router';
import { RegistrarEncargadoComponent } from './registrar-encargado/registrar-encargado.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarEncargadoComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'login' }
];
