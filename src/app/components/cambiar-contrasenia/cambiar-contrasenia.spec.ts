import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContrasenia } from './cambiar-contrasenia';

describe('CambiarContrasenia', () => {
  let component: CambiarContrasenia;
  let fixture: ComponentFixture<CambiarContrasenia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarContrasenia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarContrasenia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
