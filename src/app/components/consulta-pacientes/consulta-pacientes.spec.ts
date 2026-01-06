import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPacientes } from './consulta-pacientes';

describe('ConsultaPacientes', () => {
  let component: ConsultaPacientes;
  let fixture: ComponentFixture<ConsultaPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaPacientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
