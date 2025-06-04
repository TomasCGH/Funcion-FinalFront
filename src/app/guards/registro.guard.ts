import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegistroGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const org = localStorage.getItem('orgSeleccionada');
    if (org) {
      return true;
    }
    alert('⚠️ Solo una organización deportiva puede registrar un encargado.');
    return this.router.parseUrl('/login');
  }
}
