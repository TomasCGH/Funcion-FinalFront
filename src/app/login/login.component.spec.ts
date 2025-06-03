import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // evita errores por componentes no declarados
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render organization cards', () => {
    const orgCards = fixture.debugElement.queryAll(By.css('.card-org'));
    expect(orgCards.length).toBe(component.organizaciones.length);
  });

  it('should store selected org and navigate on click', () => {
    const testOrg = component.organizaciones[0];
    spyOn(localStorage, 'setItem');

    component.seleccionarOrg(testOrg);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'orgSeleccionada',
      JSON.stringify(testOrg)
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to admin login when clicking admin button', () => {
    component.irAAdmin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin-login']);
  });
});
