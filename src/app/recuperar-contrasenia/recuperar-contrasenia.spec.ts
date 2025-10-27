import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarContrasenia } from './recuperar-contrasenia';

describe('RecuperarContrasenia', () => {
  let component: RecuperarContrasenia;
  let fixture: ComponentFixture<RecuperarContrasenia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarContrasenia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
